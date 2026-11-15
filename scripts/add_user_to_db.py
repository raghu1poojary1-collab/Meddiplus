#!/usr/bin/env python3
"""
MediPulse — Direct User Insertion CLI into PostgreSQL
Usage: python scripts/add_user_to_db.py "Full Name" "email@example.com" "password123"
"""
import sys
import hashlib
import psycopg2

URL = "postgresql://Raghavendra:Raghvendra%406767@129.159.230.220:8056/Mediplus"

def add_user(name, email, password, role="ROLE_PATIENT"):
    pwd_hash = hashlib.sha256(password.strip().encode()).hexdigest()
    conn = psycopg2.connect(URL)
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO app_user (name, email, password_hash, role, auth_provider, created_at)
        VALUES (%s, %s, %s, %s, 'LOCAL', NOW())
        ON CONFLICT (email)
        DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
        RETURNING id, name, email, role, created_at;
    """, (name, email.strip().lower(), pwd_hash, role))
    user = cur.fetchone()

    cur.execute("""
        INSERT INTO patient (name, phone, email, password_hash, role, created_at)
        VALUES (%s, NULL, %s, %s, %s, NOW())
        ON CONFLICT DO NOTHING;
    """, (name, email.strip().lower(), pwd_hash, role))

    cur.close()
    conn.close()
    return user

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python scripts/add_user_to_db.py \"Full Name\" \"email@example.com\" \"password\"")
        print("\nListing existing users currently in PostgreSQL database:")
        conn = psycopg2.connect(URL)
        cur = conn.cursor()
        cur.execute("SELECT id, name, email, role, created_at FROM app_user ORDER BY id;")
        for u in cur.fetchall():
            print(f"  • ID {u[0]}: {u[1]} <{u[2]}> | role={u[3]} | registered={u[4]}")
        cur.close()
        conn.close()
        sys.exit(0)

    name = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    res = add_user(name, email, password)
    print(f"\n[SUCCESS] Saved user to PostgreSQL database:")
    print(f"  ID:       {res[0]}")
    print(f"  Name:     {res[1]}")
    print(f"  Email:    {res[2]}")
    print(f"  Role:     {res[3]}")
    print(f"  Created:  {res[4]}")
