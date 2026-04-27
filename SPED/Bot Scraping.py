import csv
import random
import time
from typing import List, Dict, Optional

import requests
from bs4 import BeautifulSoup

BASE_URL = "http://quotes.toscrape.com"
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
]


def get_soup(url: str) -> Optional[BeautifulSoup]:
    """
    Fetch a URL and return a BeautifulSoup object.
    Implements a random User-Agent and handles request errors.
    """
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an error for bad status codes
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None
    return BeautifulSoup(response.text, "html.parser")


def scrape_quotes_from_page(soup: BeautifulSoup) -> List[Dict[str, str]]:
    """
    Extract quotes, authors, and tags from a single page's BeautifulSoup object.
    Returns a list of dictionaries.
    """
    quotes_data = []
    quote_divs = soup.find_all("div", class_="quote")

    for quote in quote_divs:
        text = quote.find("span", class_="text").text if quote.find("span", class_="text") else ""
        author = quote.find("small", class_="author").text if quote.find("small", class_="author") else ""

        # Extract all tags for this quote
        tags = [tag.text for tag in quote.find_all("a", class_="tag")]

        quotes_data.append({
            "quote": text,
            "author": author,
            "tags": ", ".join(tags)   # store as a single string (CSV friendly)
        })
    return quotes_data


def get_next_page_url(soup: BeautifulSoup) -> Optional[str]:
    """
    Find the 'Next' button URL. Returns None if no next page exists.
    """
    next_button = soup.find("li", class_="next")
    if next_button and next_button.find("a"):
        relative_path = next_button.find("a")["href"]
        return BASE_URL + relative_path
    return None


def scrape_all_quotes(max_pages: int = None, delay_range: tuple = (1, 3)) -> List[Dict[str, str]]:
    """
    Crawl all pages (or up to max_pages) and collect all quotes.
    """
    all_quotes = []
    current_url = BASE_URL + "/page/1/"
    page_num = 1

    while current_url and (max_pages is None or page_num <= max_pages):
        print(f"Scraping page {page_num}: {current_url}")

        soup = get_soup(current_url)
        if not soup:
            break   # stop if we cannot fetch the page

        page_quotes = scrape_quotes_from_page(soup)
        if not page_quotes:
            print("No quotes found on this page – stopping.")
            break

        all_quotes.extend(page_quotes)
        print(f"  → Found {len(page_quotes)} quotes (total: {len(all_quotes)})")

        # Find next page URL
        current_url = get_next_page_url(soup)
        page_num += 1

        # Adding a delay before next request
        delay = random.uniform(*delay_range)
        print(f"  → Waiting {delay:.2f} seconds before next request...")
        time.sleep(delay)

    return all_quotes


def save_to_csv(quotes: List[Dict[str, str]], filename: str = "quotes.csv"):
    """Write the scraped data to a CSV file."""
    if not quotes:
        print("No data to save.")
        return

    with open(filename, "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["quote", "author", "tags"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(quotes)

    print(f"Successfully saved {len(quotes)} quotes to '{filename}'.")


if __name__ == "__main__":
    # Example: scrape all pages (unlimited) with random delay between 1 and 3 seconds.
    # You can limit pages by passing max_pages=2, for example.
    print("Starting scraping bot...\n")
    data = scrape_all_quotes(max_pages=None, delay_range=(1, 3))

    if data:
        save_to_csv(data)
        print("\nPreview of first scraped item:")
        print(data[0])
    else:
        print("No quotes were scraped – check your network or the target site.")