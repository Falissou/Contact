document.addEventListener("deviceready", onDeviceReady, false);

function loadContacts() {
    let options = new ContactFindOptions();
    options.multiple = true ;
    options.hasPhoneNumber = true;

    let fields = ['*']
    navigator.contacts.find(fields, showContacts, onContactError, options);
}
function showContacts(contacts){
    let htmlCode = '';

    for (const contact of contacts){
        htmlCode += `
            <li>
                <a href="#">
                    <img src="img/avatar.png">
                    <h2>${contact.name.formatted}</h2>
                    <p>${contact.phoneNumbers[0].value}</p>
                </a>
            </li>
        `;

    }

    const contactList = document.getElementById('contactList')
    contactList.innerHTML = htmlCode ;
    $(contactList).listview('refresh');

}
function onContactError(error){
    alert("Error when loading contacts: " + error); 
}

function saveContact() 
{
    const prenom = $('#prenom').val();
    const nom = $('#nom').val();
    const telephone = $('#telephone').val();
    const email = $('#email').val();

    const contact = navigator.contacts.create();
    contact.name = { givenName: prenom, familyName: nom };
    contact.phoneNumbers = [new ContactField('mobile', telephone, true)];
    contact.emails = [new ContactField('home', email, true)];

    contact.save(onSaveSuccess, onSaveError);
}
function onSaveSuccess() {
    alert('Contact saved successfully!');
    $.mobile.changePage('#homePage');
}

function onSaveError(error) {
    alert('Error saving contact: ' + error);
}

function showContactDetails(contactId) {
    navigator.contacts.find(['*'], function(contacts) {
        const contact = contacts[0];
        if (contact) {
            $('#contactName').text(contact.name.formatted);
            $('#contactPhone').text(contact.phoneNumbers[0].value);
            $('#contactEmail').text(contact.emails[0].value);

            $('#editContactButton').off('click').on('click', function() {
                editContact(contact);
            });
            $('#deleteContactButton').off('click').on('click', function() {
                deleteContact(contact);
            });

            $.mobile.changePage('#contactDetailsPage');
        }
    }, onContactError, { filter: contactId });
}

function editContact(contact) {
    $('#prenom').val(contact.name.givenName);
    $('#nom').val(contact.name.familyName);
    $('#telephone').val(contact.phoneNumbers[0].value);
    $('#email').val(contact.emails[0].value);
    $('#saveContactButton').val('Mettre à jour').off('click').on('click', function() {
        updateContact(contact);
    });

    $.mobile.changePage('#addContactPage');
}
