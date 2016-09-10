package main

import (
	"github.com/nimajalali/go-force/force"
	"github.com/nimajalali/go-force/sobjects"
	"log"
)

type Contact struct {
	sobjects.BaseSObject
	Email string `force:"Email"`
}

func (c Contact) ApiName() string {
	return "Contact"
}

type ContactQueryResponse struct {
	sobjects.BaseQuery
	Records []*Contact `force:"records"`
}

func GetContacts(forceApi *force.ForceApi) *ContactQueryResponse {
	contacts := &ContactQueryResponse{}
	err := forceApi.Query("SELECT Id, Email FROM Contact LIMIT 100", contacts)
	if err != nil {
		log.Fatal(err)
	}
	return contacts
}
