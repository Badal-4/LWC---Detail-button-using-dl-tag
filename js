import {LightningElement, track, wire} from 'lwc';

// importing apex class methods
import getContacts from '@salesforce/apex/LWCExampleController.getContacts';
import delSelectedCons from '@salesforce/apex/LWCExampleController.deleteContacts';

// importing to show toast notifictions
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

// importing to refresh the apex if any record changes the datas
import {refreshApex} from '@salesforce/apex';

const actions = [
  {
    label : 'Record Details', name : 'record_details'
  },
  {
    label : 'Edit',name : 'edit'
  },
  {
    label : 'Delete',name : 'delete'
  }
];

const columns = [
  {
  label : 'FirstName', fieldName : 'FirstName'
},
{
  label : 'LastName', fieldName : 'LastName'
},
{
  label : 'Phone', fieldName : 'Phone', type : 'phone'
},
{
  label : 'Email', fieldName: 'Email',type : 'email'
},
{
  type : 'action',
  typeAttributes : {
    rowActions : actions,
    menuAlignment : 'right'
  }
}
];

export default class zCmp extends LightningElement 
{

  @track data;
  @track columns = columns;
  @track bShowModal = false;
  @track currentRecordId;
  @track isEditForm = false;
  @track showLoadingSpinner = false;

  selectedRecords = [];
  refreshTable;
  error;

  @wire(getContacts)
  contacts(result)
  {
    this.refreshTable = result;
    if(result.data)
    {
      this.data = result.data;
      this.error = undefined;
    }
    else if(result.error)
    {
      this.error = result.error;
      this.data = undefined;
    }
  }

  handleRowActions(event)
  {
    let actionName = event.detail.action.name;
    let row = event.detail.row;

    switch(actionName)
    {
      case  'record_details' :
        this.viewCurrentRecord(row);
        break;
        case 'edit' : 
        this.editCurrentRecord(row);
        break;
        case 'delete' : 
        this.deleteCons(row);
        break;
    }
  }

viewCurrentRecord(currentRow)
{
  this.bShowModal = true;
  this.isEditForm = false;
  this.record = currentRow;
}

closeModal()
{
  this.bShowModal = false;
}
editCurrentRecord(currentRow)
{
  this.bShowModal = true;
  this.isEditForm = true;
  this.currentRecordId = currentRow.Id;
}
handleSubmit(event)
{
  event.preventDefault();
  this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
  this.bShowModal = false;
  this.dispatchEvent(new ShowToastEvent ({
    title : 'Success !!',
    message : event.detail.fields.FirstName + ' '+event.detail.LastName + 'Contact updated Successfullly!!',
    variant : 'success'
  }));
}
}
