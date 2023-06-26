from selenium import webdriver;
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import sys
print("python script running")




options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument('--silent')
driver = webdriver.Chrome(options=options)



driver.get('https://youtube.com')
searchbox = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '/html/body/ytd-app/div[1]/div/ytd-masthead/div[4]/div[2]/ytd-searchbox/form/div[1]/div[1]/input'))
)
if sys.argv[2] == 'single':
    driver.find_element(By.XPATH, '/html/body/ytd-app/div[1]/div/ytd-masthead/div[4]/div[2]/ytd-searchbox/form/div[1]/div[1]/input')
    searchbox.send_keys(sys.argv[1])

    searchButton = driver.find_element(By.XPATH, '/html/body/ytd-app/div[1]/div/ytd-masthead/div[4]/div[2]/ytd-searchbox/button')
    searchButton.click()


    videoResults = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.XPATH, "//a[@id='video-title']")),
    )

    driver.find_elements(By.XPATH, "//a[@id='video-title']")

    for result in videoResults[:5]:
        ariaValue = result.get_attribute('aria-label')
        hrefValue = result.get_attribute('href')
        print(ariaValue)
        print(hrefValue)

elif sys.argv[2] == 'multiple':
    searchResults = [],[]
    for request in sys.argv[1]:
        driver.find_element(By.XPATH, '/html/body/ytd-app/div[1]/div/ytd-masthead/div[4]/div[2]/ytd-searchbox/form/div[1]/div[1]/input')
        searchbox.send_keys(request)

        searchButton = driver.find_element(By.XPATH, '/html/body/ytd-app/div[1]/div/ytd-masthead/div[4]/div[2]/ytd-searchbox/button')
        searchButton.click()


        videoResult = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//a[@id='video-title']")),
        )

        driver.find_elements(By.XPATH, "//a[@id='video-title']")

        ariaValue = videoResult.get_attribute('aria-label')
        hrefValue = videoResult.get_attribute('href')
        combinedResults = [ariaValue, hrefValue]

        searchResults += combinedResults;

    print(searchResults)



