import requests
import json

BASE_URL = "https://api.ratsstore.my.id"


def login(email, password):
    """Login dan dapatkan access token"""
    url = f"{BASE_URL}/auth/login"
    payload = {"email": email, "password": password}
    
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        if response.status_code == 200:
            print(f"[✓] Login berhasil sebagai {data['user']['nama']} ({data['user']['role']})\n")
            return data['access_token']
        else:
            print(f"[✗] Login gagal: {data.get('error', 'Unknown error')}")
            return None
    except Exception as e:
        print(f"[✗] Error saat login: {str(e)}")
        return None


def list_proxies(access_token, page=1, limit=5, search=""):
    """List proxy dengan pagination"""
    url = f"{BASE_URL}/api/proxy"
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"page": page, "limit": limit}
    
    if search:
        params["search"] = search
    
    try:
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        
        if response.status_code == 200 and 'pagination' in data:
            return data
        else:
            print(f"[✗] Gagal list proxy: {data.get('error', 'Unknown error')}")
            return None
    except Exception as e:
        print(f"[✗] Error saat list proxy: {str(e)}")
        return None


def display_proxies(data):
    """Tampilkan data proxy"""
    if not data or 'data' not in data:
        print("[!] Tidak ada data proxy")
        return
    
    pagination = data.get('pagination', {})
    proxies = data['data']
    
    print("=" * 80)
    print(f"📋 LIST PROXY - Page {pagination.get('page', 1)} of {pagination.get('totalPages', 1)}")
    print(f"Total: {pagination.get('total', 0)} proxies")
    print("=" * 80)
    
    if not proxies:
        print("\n[!] Tidak ada proxy ditemukan\n")
        return
    
    for i, proxy in enumerate(proxies, 1):
        print(f"\n{i}. Email: {proxy['accounts']}")
        print(f"   UUID: {proxy['id']}")
        print(f"   User ID: {proxy.get('user_id', 'N/A')}")
        print(f"   Token: {'✓ Ada' if proxy.get('token') else '✗ Belum'}")
        print(f"   Created: {proxy['created_at'][:19]}")
    
    print("\n" + "=" * 80)


def main():
    print("=" * 80)
    print("🔐 PROXY LIST VIEWER")
    print("=" * 80 + "\n")
    
    # Login
    email = input("Email: ")
    password = input("Password: ")
    
    access_token = login(email, password)
    if not access_token:
        return
    
    # State
    current_page = 1
    limit = 5
    search_query = ""
    
    while True:
        # Fetch data
        data = list_proxies(access_token, current_page, limit, search_query)
        
        if not data:
            print("\n[✗] Gagal mengambil data")
            break
        
        # Display
        display_proxies(data)
        
        pagination = data.get('pagination', {})
        total_pages = pagination.get('totalPages', 1)
        
        # Menu
        print("\n📌 MENU:")
        print("  [n] Next page")
        print("  [p] Previous page")
        print("  [s] Search")
        print("  [c] Clear search")
        print("  [g] Go to page")
        print("  [r] Refresh")
        print("  [q] Quit")
        
        choice = input("\nPilih: ").lower().strip()
        
        if choice == 'n':
            if current_page < total_pages:
                current_page += 1
            else:
                print("\n[!] Sudah di halaman terakhir")
                input("Tekan Enter untuk lanjut...")
        
        elif choice == 'p':
            if current_page > 1:
                current_page -= 1
            else:
                print("\n[!] Sudah di halaman pertama")
                input("Tekan Enter untuk lanjut...")
        
        elif choice == 's':
            search_query = input("\nCari email: ").strip()
            current_page = 1  # Reset ke page 1
            print(f"\n[✓] Mencari: {search_query}")
        
        elif choice == 'c':
            search_query = ""
            current_page = 1
            print("\n[✓] Search cleared")
        
        elif choice == 'g':
            try:
                page = int(input(f"\nGo to page (1-{total_pages}): "))
                if 1 <= page <= total_pages:
                    current_page = page
                else:
                    print(f"\n[✗] Page harus antara 1-{total_pages}")
                    input("Tekan Enter untuk lanjut...")
            except ValueError:
                print("\n[✗] Input tidak valid")
                input("Tekan Enter untuk lanjut...")
        
        elif choice == 'r':
            print("\n[✓] Refreshing...")
        
        elif choice == 'q':
            print("\n[✓] Bye!")
            break
        
        else:
            print("\n[✗] Pilihan tidak valid")
            input("Tekan Enter untuk lanjut...")


if __name__ == "__main__":
    main()
