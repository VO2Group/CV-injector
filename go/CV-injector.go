package main

import (
	"bufio"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

func parse(url string) {
	resp, err := http.Get(url)
	if err != nil {
		log.Println(err)
		return
	}

	defer resp.Body.Close()

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return
	}

	html := string(bytes)
	log.Println(html)
}

func main() {
	log.Println("CV-injector")
	reader := bufio.NewReader(os.Stdin)

	for {
		log.Println("Copy/Paste LinkedIn public profile url...")
		url, err := reader.ReadString('\n')
		if err != nil {
			log.Println(err)
			continue
		}

		url = strings.TrimSuffix(url, "\n")
		log.Printf("Inject profile %v\n", url)
		parse(url)
	}
}
