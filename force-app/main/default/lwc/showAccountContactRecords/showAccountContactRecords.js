import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import retrieveContacts from '@salesforce/apex/RetrieveAccountswithContacts.retrieveContacts';

export default class showAccountContactRecords extends LightningElement {
    @api recordId; //Account Id, coming from UI
    @track accountRecord; //Account Record will be retrieved using wire
    @track error; // if any error occurs, error will be assigned to this property
    contactlength; //Number of contacts of Account

    @track customerSuccessContacts; //Customer Service Contact List
    @track appDevContacts; //Application Developer Contact List

    //Fields to be sent in wire
    @track fields = ['Account.Name', 'Account.NumberOfEmployees', 'Account.Shipping_Region_Name__c', 'Account.Phone', 'Account.BillingStreet', 'Account.BillingCity', 'Account.BillingState', 'Account.BillingPostalCode'];

    //Retrieving account record using wire
    @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
    retrieveAccountData({ error, data }) {
        if (data) {
            this.accountRecord = data;
            this.error = undefined;

            let accountId = this.recordId;

            //Retrieving Contacts
            retrieveContacts({ accId: accountId })
                .then(result => {
                    this.contactlength = result.length;
                    this.customerSuccessContacts = result.filter(item => item.Title === 'Customer Success');
                    this.appDevContacts = result.filter(item => item.Title === 'Application Developer');                  
                })
                .catch(error => {
                    this.error = error;
                    console.log(`in contact error`);
                });

        } else if (error) {
            console.log(`in error`);
            this.error = error;
            this.accountRecord = undefined;
        }
    }   
}