import unittest
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.services.seeder import seed_database

class TestCloudSentinelAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
        cls.client = TestClient(app)

    def test_01_root_and_health(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("CloudSentinel", res.json()["platform"])

        res_h = self.client.get("/health")
        self.assertEqual(res_h.status_code, 200)
        self.assertEqual(res_h.json()["status"], "HEALTHY")

    def test_02_auth_login_success_and_failure(self):
        # Valid login
        res = self.client.post("/api/auth/login", json={
            "email": "admin@cloudsentinel.io",
            "password": "Password123!"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["role"], "ADMIN")

        # Invalid login
        res_fail = self.client.post("/api/auth/login", json={
            "email": "admin@cloudsentinel.io",
            "password": "WrongPassword!"
        })
        self.assertEqual(res_fail.status_code, 401)

    def test_03_dashboard_summary(self):
        res = self.client.get("/api/dashboard/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("security_risk_score", data)
        self.assertGreater(data["monitored_resources"], 10)
        self.assertGreater(data["security_events_count"], 50)
        self.assertIn("factors", data["risk_breakdown"])

    def test_04_users_and_iam(self):
        res = self.client.get("/api/users")
        self.assertEqual(res.status_code, 200)
        users = res.json()
        self.assertGreaterEqual(len(users), 20)

    def test_05_resources(self):
        res = self.client.get("/api/resources")
        self.assertEqual(res.status_code, 200)
        resources = res.json()
        self.assertGreaterEqual(len(resources), 15)

    def test_06_events_and_alerts(self):
        res_e = self.client.get("/api/events?limit=10")
        self.assertEqual(res_e.status_code, 200)
        self.assertEqual(len(res_e.json()), 10)

        res_a = self.client.get("/api/alerts")
        self.assertEqual(res_a.status_code, 200)
        self.assertGreater(len(res_a.json()), 10)

    def test_07_threats_and_relationship_graph(self):
        res_t = self.client.get("/api/threats")
        self.assertEqual(res_t.status_code, 200)
        self.assertGreater(len(res_t.json()), 5)

        res_g = self.client.get("/api/threats/graph")
        self.assertEqual(res_g.status_code, 200)
        graph = res_g.json()
        self.assertIn("nodes", graph)
        self.assertIn("links", graph)

    def test_08_attack_simulation_workflow(self):
        # Step 1
        res1 = self.client.post("/api/simulation/run-step?scenario_id=credential_abuse&step=1")
        self.assertEqual(res1.status_code, 200)
        self.assertEqual(res1.json()["step"], 1)

        # Step 5: Containment
        res5 = self.client.post("/api/simulation/run-step?scenario_id=credential_abuse&step=5")
        self.assertEqual(res5.status_code, 200)
        self.assertEqual(res5.json()["status"], "CONTAINED")

        # Reset simulation back to clean baseline
        res_reset = self.client.post("/api/simulation/reset")
        self.assertEqual(res_reset.status_code, 200)
        self.assertEqual(res_reset.json()["status"], "SUCCESS")

    def test_09_malware_scan(self):
        res = self.client.post("/api/malware/scan", json={
            "file_name": "reverse_shell_sim.py",
            "file_type": "Python Script"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["verdict"], "MALICIOUS")
        self.assertGreater(data["risk_score"], 80)

if __name__ == "__main__":
    unittest.main()
