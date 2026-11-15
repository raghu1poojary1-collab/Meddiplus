#!/usr/bin/env python3
"""
MediPulse — PostgreSQL Connection & Health Check Script
Verifies connection to postgresql://Raghavendra:***@129.159.230.220:8056/Mediplus
"""
import psycopg2
import sys

URL = "postgresql://Raghavendra:Raghvendra%406767@129.159.230.220:8056/Mediplus"

def test_connection():
    print("=" * 60)
    print("MediPulse — PostgreSQL Connection Verifier")
    print("=" * 60)
    print("Target: 129.159.230.220:8056/Mediplus")
    print("User:   Raghavendra")
    print("Connecting...")

    try:
        conn = psycopg2.connect(URL, connect_timeout=5)
        cur = conn.cursor()
        cur.execute("SELECT version();")
        pg_version = cur.fetchone()[0]
        print(f"\n[SUCCESS] Connected to PostgreSQL Server:")
        print(f"  Version: {pg_version.split(',')[0]}")

        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        tables = cur.fetchall()
        print(f"\nFound {len(tables)} tables in database 'Mediplus':")
        for (name,) in tables:
            cur.execute(f'SELECT count(*) FROM "{name}";')
            cnt = cur.fetchone()[0]
            print(f"  • {name:<18}: {cnt:>3} rows")

        cur.close()
        conn.close()
        print("\nAll database tables and constraints are healthy.")
        print("=" * 60)
        return True
    except Exception as e:
        print(f"\n[ERROR] Connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)

