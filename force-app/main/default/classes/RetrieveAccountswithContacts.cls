public with sharing class RetrieveAccountswithContacts {
    @AuraEnabled
    public static List<Contact> retrieveContacts(String accId){
        List<Contact> conList = new List<Contact>();
        System.debug('accId : '+accId);
        if(String.isNotBlank(accId)){
            conList = [SELECT Id,LastName,Title from Contact Where AccountId = :accId];
        }
        System.debug('conList : '+conList);
        return  conList;
    }    
}
