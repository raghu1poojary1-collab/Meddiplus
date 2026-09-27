import { 
  HospitalResourceItem, 
  HospitalResourceInventory, 
  ResourceSearchResult, 
  ResourceStatus 
} from '../types/hospitalResource';
import { 
  MEDICAL_PROCEDURES, 
  getHospitalResourceInventory, 
  formatDataFreshness 
} from '../data/hospitalResourcesData';

export function evaluateHospitalResourceSearch(
  hospitalId: string,
  hospitalName: string,
  searchQuery: string = ''
): ResourceSearchResult {
  const inventory = getHospitalResourceInventory(hospitalId, hospitalName);
  const { text: timeAgoFormatted, isOutdated } = formatDataFreshness(inventory.lastUpdated);

  const cleanQuery = searchQuery.trim().toLowerCase();

  // 1. Check if query matches a known medical procedure
  const matchedProcedure = MEDICAL_PROCEDURES.find(p => 
    p.keywords.some(kw => cleanQuery.includes(kw.toLowerCase()) || cleanQuery.includes(p.name.toLowerCase()))
  );

  let targetResources: HospitalResourceItem[] = [];
  let queryType: ResourceSearchResult['queryType'] = 'GENERAL';
  let matchedProcedureName: string | undefined = undefined;

  if (matchedProcedure) {
    queryType = 'PROCEDURE';
    matchedProcedureName = matchedProcedure.name;
    // Filter hospital resources that correspond to procedure requirements
    targetResources = inventory.resources.filter(res => 
      matchedProcedure.requiredResourceNames.some(req => 
        res.name.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(res.name.toLowerCase())
      )
    );
  } else if (cleanQuery.length > 0) {
    queryType = 'RESOURCE';
    targetResources = inventory.resources.filter(res => 
      res.name.toLowerCase().includes(cleanQuery) || 
      res.category.toLowerCase().includes(cleanQuery)
    );
  } else {
    // Default to all resources
    targetResources = [...inventory.resources];
  }

  // Categorize matched resources into Available, Limited, Unavailable
  const availableResources: HospitalResourceItem[] = [];
  const limitedResources: HospitalResourceItem[] = [];
  const unavailableResources: HospitalResourceItem[] = [];

  targetResources.forEach(res => {
    if (res.status === 'NOT_AVAILABLE' || res.available === 0) {
      unavailableResources.push(res);
    } else if (res.status === 'LIMITED') {
      limitedResources.push(res);
    } else {
      availableResources.push(res);
    }
  });

  // Calculate overall query-specific status for map marker & search filters
  let overallStatus: ResourceStatus = 'AVAILABLE';

  if (cleanQuery.length > 0) {
    if (targetResources.length === 0) {
      overallStatus = 'UNKNOWN';
    } else if (unavailableResources.length > 0) {
      overallStatus = 'NOT_AVAILABLE';
    } else if (limitedResources.length > 0) {
      overallStatus = 'LIMITED';
    } else {
      overallStatus = 'AVAILABLE';
    }
  } else {
    // General overall status
    if (unavailableResources.length > 3) {
      overallStatus = 'LIMITED';
    } else {
      overallStatus = 'AVAILABLE';
    }
  }

  return {
    hospitalId,
    hospitalName,
    query: searchQuery,
    queryType,
    matchedProcedureName,
    overallStatus,
    availableResources: availableResources.length > 0 ? availableResources : inventory.resources.filter(r => r.status === 'AVAILABLE'),
    limitedResources: limitedResources.length > 0 ? limitedResources : inventory.resources.filter(r => r.status === 'LIMITED'),
    unavailableResources: unavailableResources.length > 0 ? unavailableResources : inventory.resources.filter(r => r.status === 'NOT_AVAILABLE'),
    unknownResources: cleanQuery.length > 0 && targetResources.length === 0 ? [searchQuery] : [],
    lastUpdated: inventory.lastUpdated,
    isOutdated,
    timeAgoFormatted,
  };
}
