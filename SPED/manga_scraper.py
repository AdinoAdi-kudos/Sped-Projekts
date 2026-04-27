import cloudscraper
import requests
from bs4 import BeautifulSoup
import os
import time
import re

MANGAS = [{
    "name": "full-time-awakening",  # Name see in the url
    "title": "Full_Time_Awakening", # Name for local folder
    "end_chapter": 88               # Number of chapters to scrape
}]

def sanitize_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name)

def get_chapter_reader_url(manga_name, chapter_num):
    return f"https://www.natomanga.com/manga/{manga_name}/chapter-{chapter_num}"

def download_image(img_url, folder_path, img_index, chapter_num, headers):
    try:
        img_data = requests.get(img_url, headers=headers, stream=True, timeout=10)
        if img_data.status_code == 200:
            img_extension = "jpg"
            if "image/png" in img_data.headers.get("Content-Type", ""):
                img_extension = "png"
            if "image/webp" in img_data.headers.get("Content-Type", ""):
                img_extension = "webp"
            file_name = f"chapter_{chapter_num}_page_{img_index}.{img_extension}"
            file_path = os.path.join(folder_path, file_name)
            with open(file_path, 'wb') as f:
                for chunk in img_data.iter_content(1024):
                    f.write(chunk)
            return True
        else:
            print(f"Failed to download image. HTTP Status: {img_data.status_code}")
    except Exception as e:
        print(f"Error downloading image: {e}")
    return False

def scrape_manga_images(manga_details):
    scraper = cloudscraper.create_scraper(browser={
        'browser': 'chrome',
        'platform': 'windows',
        'desktop': True
    })
    headers = {'Referer': 'https://www.natomanga.com/'}
    manga_name = manga_details["name"]
    title = manga_details["title"]
    end_chapter = manga_details["end_chapter"]
    total_chapters_to_scrape = end_chapter
    print(f"Starting to scrape {total_chapters_to_scrape} chapters for {title}.")
    
    for chapter_num in range(1, total_chapters_to_scrape + 1):
        chapter_url = get_chapter_reader_url(manga_name, chapter_num)
        print(f"\nProcessing Chapter {chapter_num}: {chapter_url}")
        try:
            response = scraper.get(chapter_url)
            if response.status_code != 200:
                print(f"Failed to access chapter {chapter_num}. Status Code: {response.status_code}")
                continue
            soup = BeautifulSoup(response.text, "html.parser")
            img_tags = soup.find_all("img")
            manga_pages = []
            for img in img_tags:
                img_url = img.get("src")
                if not img_url:
                    continue
                if "https" not in img_url and img_url.startswith("/"):
                    img_url = "https://www.natomanga.com" + img_url
                if "natomanga.com" in img_url and "uploads" in img_url:
                    if img_url not in manga_pages:
                        manga_pages.append(img_url)
            if not manga_pages:
                print(f"Warning: No images found for Chapter {chapter_num}.")
                continue
            chapter_folder = os.path.join(".", sanitize_filename(title), f"Chapter_{chapter_num}")
            if not os.path.exists(chapter_folder):
                os.makedirs(chapter_folder)
                print(f"Created directory: {chapter_folder}")
            print(f"Downloading {len(manga_pages)} images for Chapter {chapter_num}...")
            for idx, img_url in enumerate(manga_pages, start=1):
                if download_image(img_url, chapter_folder, idx, chapter_num, headers):
                    print(f"Downloaded image {idx}/{len(manga_pages)} for Chapter {chapter_num}")
                else:
                    print(f"Failed to download image {idx} for Chapter {chapter_num}.")
                time.sleep(1)
            print(f"Completed Chapter {chapter_num}.")
        except Exception as e:
            print(f"An unexpected error occurred for chapter {chapter_num}: {e}")

if __name__ == "__main__":
    for manga in MANGAS:
        scrape_manga_images(manga)