package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"github.com/nimajalali/go-force/force"
	"log"
	"os"
)

type Configuration struct {
	UserName      string `json:"username"`
	Password      string `json:"password"`
	SecurityToken string `json:"securitytoken"`
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
		"v36.0",
		"3MVG98_Psg5cppyZckKdoYkY6MH4eEM.NhuDlIY0Pckhhph_2odWblFX4dA3oCXiisoFRTPCIY5aaXs0Xa4LV",
		"2266513958814482958",
		config.UserName,
		config.Password,
		config.SecurityToken,
		"production",
	)
	if err != nil {
		log.Fatal(err)
	}
	return forceApi
}

var configPath string

func init() {
	flag.StringVar(&configPath, "config", "config.json", "Path to config file")
	flag.Usage = func() {
		fmt.Println("Usage: ForceBatch [flags] ...")
		flag.PrintDefaults()
	}
}

func main() {
	flag.Parse()

	config := NewConfiguration(configPath)

	forceApi := NewForceApi(config)

	contacts := GetContacts(forceApi)
	for _, contact := range contacts.Records {
		log.Printf("%v, %v\n", contact.Id, contact.Email)
	}
}
