package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"github.com/nimajalali/go-force/force"
	"golang.org/x/net/html"
	"log"
	"net/http"
	"os"
	"strings"
)

type Configuration struct {
	ApiVersion    string `json:"apiversion"`
	ClientId      string `json:"clientid"`
	ClientSecret  string `json:"clientsecret"`
	UserName      string `json:"username"`
	Password      string `json:"password"`
	SecurityToken string `json:"securitytoken"`
	Environment   string `json:"environment"`
}

func NewConfiguration(path string) *Configuration {
	config := Configuration{}
	file, _ := os.Open(path)
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		log.Fatal(err)
	}
	return &config
}

func NewForceApi(config *Configuration) *force.ForceApi {
	forceApi, err := force.Create(
		config.ApiVersion,
		config.ClientId,
		config.ClientSecret,
		config.UserName,
		config.Password,
		config.SecurityToken,
		config.Environment,
	)
	if err != nil {
		log.Fatal(err)
	}
	return forceApi
}

func isLinkedIn(url string) bool {
	return strings.HasPrefix(url, "https://www.linkedin.com/")
}

func parse(url string) {
	resp, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}

	z := html.NewTokenizer(resp.Body)
	defer resp.Body.Close()

	for {
		tt := z.Next()

		switch {
		case tt == html.ErrorToken:
			return
		case tt == html.StartTagToken:
			return
		}
	}
}

func main() {
	configPath := flag.String("config", "config.json", "Path to config file")
	brand := flag.String("brand", "IT", "Brand (IT, FORCE, DATA, FINANCE)")

	flag.Parse()

	config := NewConfiguration(*configPath)
	forceApi := NewForceApi(config)

	for _, url := range flag.Args() {
		if !isLinkedIn(url) {
			log.Fatal(fmt.Errorf("%v is not a valid url !", url))
		}

		log.Printf("%v %v %v", *forceApi, *brand, url)
		parse(url)
	}
}
