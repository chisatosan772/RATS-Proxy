import requests
import json
import time

BASE_URL = "https://api.ratsstore.my.id"

# Test credentials
ADMIN_EMAIL = "aku@mail.com"
ADMIN_PASSWORD = "masuk123"

# Proxy accounts
OWLPROXY_EMAIL = "wqu5rmr2@nladsgiare.shop"
FUSIONPROXY_EMAIL = "kosaji52@gmail.com"
FUSIONPROXY_PASSWORD = "masuk123"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_success(msg):
    print(f"{GREEN}✓ {msg}{RESET}")

def print_error(msg):
    print(f"{RED}✗ {msg}{RESET}")

def print_info(msg):
    print(f"{BLUE}ℹ {msg}{RESET}")

def print_warning(msg):
    print(f"{YELLOW}⚠ {msg}{RESET}")

def print_section(title):
    print(f"\n{BLUE}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{RESET}\n")


# ============================================
# 1. LOGIN ADMIN
# ============================================
def login_admin():
    print_section("1. LOGIN ADMIN")
    
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        if response.status_code == 200:
            print_success(f"Login berhasil sebagai {data['user']['nama']} ({data['user']['role']})")
            print_info(f"Access Token: {data['access_token'][:50]}...")
            return data['access_token']
        else:
            print_error(f"Login gagal: {data.get('error', 'Unknown error')}")
            return None
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return None


# ============================================
# 2. CREATE OWLPROXY
# ============================================
def create_owlproxy(access_token):
    print_section("2. CREATE OWLPROXY")
    
    url = f"{BASE_URL}/api/proxy"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "accounts": OWLPROXY_EMAIL,
        "proxy_type": "owlproxy"
    }
    
    try:
        print_info(f"Creating OwlProxy for: {OWLPROXY_EMAIL}")
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        
        if response.status_code == 201:
            print_success("OwlProxy created successfully!")
            print_info(f"UUID: {data['data']['id']}")
            print_info(f"Email: {data['data']['accounts']}")
            print_info(f"Type: {data['data']['proxy_type']}")
            return data['data']['id']
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return None
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return None


# ============================================
# 3. CREATE FUSIONPROXY
# ============================================
def create_fusionproxy(access_token):
    print_section("3. CREATE FUSIONPROXY")
    
    url = f"{BASE_URL}/api/proxy"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "accounts": FUSIONPROXY_EMAIL,
        "password": FUSIONPROXY_PASSWORD,
        "proxy_type": "fusionproxy"
    }
    
    try:
        print_info(f"Creating FusionProxy for: {FUSIONPROXY_EMAIL}")
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        
        if response.status_code == 201:
            print_success("FusionProxy created successfully!")
            print_info(f"UUID: {data['data']['id']}")
            print_info(f"Email: {data['data']['accounts']}")
            print_info(f"Type: {data['data']['proxy_type']}")
            return data['data']['id']
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return None
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return None


# ============================================
# 4. CHECK OWLPROXY QUOTA
# ============================================
def check_owlproxy_quota(uuid):
    print_section("4. CHECK OWLPROXY QUOTA")
    
    url = f"{BASE_URL}/api/checkProxy"
    payload = {"uuid": uuid}
    
    try:
        print_info(f"Checking quota for OwlProxy UUID: {uuid}")
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get('success'):
            print_success("Quota check successful!")
            quota_data = data.get('data', {})
            print_info(f"Proxy Type: {quota_data.get('proxyType', 'N/A')}")
            print_info(f"Remaining: {quota_data.get('remainingTraffic', 0)} {quota_data.get('unit', 'N/A')}")
            print_info(f"Used: {quota_data.get('usedTraffic', 0)} {quota_data.get('unit', 'N/A')}")
            return True
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# ============================================
# 5. CHECK FUSIONPROXY QUOTA
# ============================================
def check_fusionproxy_quota(uuid):
    print_section("5. CHECK FUSIONPROXY QUOTA")
    
    url = f"{BASE_URL}/api/checkProxy"
    payload = {"uuid": uuid}
    
    try:
        print_info(f"Checking quota for FusionProxy UUID: {uuid}")
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get('success'):
            print_success("Quota check successful!")
            quota_data = data.get('data', {})
            print_info(f"Proxy Type: {quota_data.get('proxyType', 'N/A')}")
            print_info(f"Remaining: {quota_data.get('remainingTraffic', 0)} {quota_data.get('unit', 'N/A')}")
            print_info(f"Used: {quota_data.get('usedTraffic', 0)} {quota_data.get('unit', 'N/A')}")
            return True
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# ============================================
# 6. GET OWLPROXY REGIONS
# ============================================
def get_owlproxy_regions(uuid):
    print_section("6. GET OWLPROXY REGIONS")
    
    url = f"{BASE_URL}/api/getProxyRegion"
    payload = {"uuid": uuid}
    
    try:
        print_info(f"Getting regions for OwlProxy UUID: {uuid}")
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get('success'):
            print_success(f"Found {len(data['data'])} regions!")
            print_info(f"Proxy Type: {data.get('proxyType', 'N/A')}")
            print_info("Sample regions:")
            for region in data['data'][:5]:
                print(f"  - {region.get('countryName', region.get('name', 'N/A'))} ({region.get('region', 'N/A')})")
            return True
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# ============================================
# 7. GET FUSIONPROXY COUNTRIES
# ============================================
def get_fusionproxy_countries(uuid):
    print_section("7. GET FUSIONPROXY COUNTRIES")
    
    url = f"{BASE_URL}/api/getProxyRegion"
    payload = {"uuid": uuid}
    
    try:
        print_info(f"Getting countries for FusionProxy UUID: {uuid}")
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get('success'):
            print_success(f"Found {len(data['data'])} countries!")
            print_info(f"Proxy Type: {data.get('proxyType', 'N/A')}")
            print_info("Sample countries:")
            for country in data['data'][:5]:
                print(f"  - {country.get('name', 'N/A')}")
            return True
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# ============================================
# 8. CREATE OWLPROXY INSTANCE
# ============================================
def create_owlproxy_instance(uuid):
    print_section("8. CREATE OWLPROXY INSTANCE")
    
    url = f"{BASE_URL}/api/createProxy"
    payload = {
        "uuid": uuid,
        "country": "US"  # United States
    }
    
    try:
        print_info(f"Creating OwlProxy instance for country: US")
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get('success'):
            print_success("Proxy instance created!")
            print_info(f"Proxy Type: {data['data'].get('proxyType', 'N/A')}")
            print_info(f"Proxy String: {data['data']['proxy']}")
            return True
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# ============================================
# 9. CREATE FUSIONPROXY INSTANCE
# ============================================
def create_fusionproxy_instance(uuid):
    print_section("9. CREATE FUSIONPROXY INSTANCE")
    
    url = f"{BASE_URL}/api/createProxy"
    payload = {
        "uuid": uuid,
        "country": "United States"  # Full country name
    }
    
    try:
        print_info(f"Creating FusionProxy instance for country: United States")
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get('success'):
            print_success("Proxy instance created!")
            print_info(f"Proxy Type: {data['data'].get('proxyType', 'N/A')}")
            print_info(f"Proxy String: {data['data']['proxy']}")
            return True
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# ============================================
# 10. LIST ALL PROXIES
# ============================================
def list_all_proxies(access_token):
    print_section("10. LIST ALL PROXIES")
    
    url = f"{BASE_URL}/api/proxy"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        print_info("Fetching all proxies...")
        response = requests.get(url, headers=headers)
        data = response.json()
        
        if response.status_code == 200:
            proxies = data.get('data', [])
            print_success(f"Found {len(proxies)} proxies!")
            
            for i, proxy in enumerate(proxies, 1):
                print(f"\n  {i}. {proxy['accounts']}")
                print(f"     UUID: {proxy['id']}")
                print(f"     Type: {proxy['proxy_type']}")
                print(f"     Created: {proxy['created_at'][:19]}")
            return True
        else:
            print_error(f"Failed: {data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# ============================================
# MAIN TEST RUNNER
# ============================================
def main():
    print(f"\n{BLUE}{'='*60}")
    print(f"  🧪 PROXY INTEGRATION TEST")
    print(f"{'='*60}{RESET}\n")
    
    results = {
        "passed": 0,
        "failed": 0
    }
    
    # 1. Login Admin
    access_token = login_admin()
    if not access_token:
        print_error("\n❌ Test stopped: Login failed")
        return
    results["passed"] += 1
    time.sleep(1)
    
    # 2. Create OwlProxy
    owlproxy_uuid = create_owlproxy(access_token)
    if owlproxy_uuid:
        results["passed"] += 1
    else:
        results["failed"] += 1
    time.sleep(1)
    
    # 3. Create FusionProxy
    fusionproxy_uuid = create_fusionproxy(access_token)
    if fusionproxy_uuid:
        results["passed"] += 1
    else:
        results["failed"] += 1
    time.sleep(1)
    
    # 4. Check OwlProxy Quota
    if owlproxy_uuid:
        if check_owlproxy_quota(owlproxy_uuid):
            results["passed"] += 1
        else:
            results["failed"] += 1
        time.sleep(1)
    
    # 5. Check FusionProxy Quota
    if fusionproxy_uuid:
        if check_fusionproxy_quota(fusionproxy_uuid):
            results["passed"] += 1
        else:
            results["failed"] += 1
        time.sleep(1)
    
    # 6. Get OwlProxy Regions
    if owlproxy_uuid:
        if get_owlproxy_regions(owlproxy_uuid):
            results["passed"] += 1
        else:
            results["failed"] += 1
        time.sleep(1)
    
    # 7. Get FusionProxy Countries
    if fusionproxy_uuid:
        if get_fusionproxy_countries(fusionproxy_uuid):
            results["passed"] += 1
        else:
            results["failed"] += 1
        time.sleep(1)
    
    # 8. Create OwlProxy Instance
    if owlproxy_uuid:
        if create_owlproxy_instance(owlproxy_uuid):
            results["passed"] += 1
        else:
            results["failed"] += 1
        time.sleep(1)
    
    # 9. Create FusionProxy Instance
    if fusionproxy_uuid:
        if create_fusionproxy_instance(fusionproxy_uuid):
            results["passed"] += 1
        else:
            results["failed"] += 1
        time.sleep(1)
    
    # 10. List All Proxies
    if list_all_proxies(access_token):
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Summary
    print_section("TEST SUMMARY")
    total = results["passed"] + results["failed"]
    print(f"Total Tests: {total}")
    print_success(f"Passed: {results['passed']}")
    if results["failed"] > 0:
        print_error(f"Failed: {results['failed']}")
    else:
        print_success(f"Failed: {results['failed']}")
    
    if results["failed"] == 0:
        print(f"\n{GREEN}🎉 ALL TESTS PASSED!{RESET}\n")
    else:
        print(f"\n{YELLOW}⚠️  SOME TESTS FAILED{RESET}\n")


if __name__ == "__main__":
    main()
