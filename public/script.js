var app = new Vue({
  el: '#app',
  created() {
    this.getClients();
  },
  data: {
    viewFlag: true,
    name:"",
    address:"",
    pin:"",
    amount:0,
    transaction:0,
    transactionNote: "",
    selectedClient: null,
    clients: [],
  },
  methods: {
    selectClient(client){
      this.selectedClient = client;
      this.name=client.name;
      this.address=client.address;
      this.pin=client.pin;
      this.amount=client.amount;
      this.transaction=0;
      this.transactionNote="";
    },
    clickView(){
      this.viewFlag=true;
    },
    clickEdit(){
      this.viewFlag=false;
    },
    clearSelection(){
      this.selectedClient=null;
      this.name="";
      this.address="";
      this.pin="";
      this.amount=0;
      this.transaction=0;
      this.transactionNote="";
    },
    async getClients() {
      try {
        let response = await axios.get("/api/clients");
        this.clients = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addClient() {
      try {
        let str = "Initial deposit: $"+this.amount+".";

        //check input
        if(this.name === ""){
          window.alert("Missing Name field!");
          return;
        }else if(this.address === ""){
          window.alert("Missing Address field!");
          return;
        }else if(isNaN(this.pin)){
          window.alert("The PIN can only contain numbers!");
          return;
        }else if(this.pin.length !== 4){
          window.alert("The PIN must be 4 digits long (including leading zeros)!");
          return;
        }else if(this.amount<0){
          window.alert("Cannot open an account with a negative initial deposit!");
          return;
        }

        let r = await axios.post('/api/clients', {
          name: this.name,
          address: this.address,
          pin: this.pin,
          amount: this.amount,
          history: str,
        });
        this.getClients();
        console.log("New client added");
      } catch (error) {
        console.log(error);
      }
    },
    async deleteClient(client) {
      try {
        let response = axios.delete("/api/clients/" + client._id);
        this.selectedClient = null;
        this.getClients();
        this.clearSelection();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editClient(selectedClient){
      //check input
      if(this.name === ""){
        window.alert("Missing Name field!");
        return;
      }else if(this.address === ""){
        window.alert("Missing Address field!");
        return;
      }else if(isNaN(this.pin)){
        window.alert("The PIN can only contain numbers!");
        return;
      }else if(this.pin.length !== 4){
        window.alert("The PIN must be 4 digits long (including leading zeros)!");
        return;
      }else if(isNaN(this.transaction)){
        window.alert("The Transaction field can only contain numbers!");
        return;
      }else if(Number(this.selectedClient.amount)+Number(this.transaction) < 0){
        window.alert("You cannot withdraw more than the current balance!");
        return;
      }

      try {
        let transactionStr ="";
        if(this.transaction < 0){
          transactionStr=" Withdrawal $"+Math.abs(this.transaction);
          if(this.transactionNote != ""){
            transactionStr+=" ("+this.transactionNote+")";
          }
          transactionStr+=".";
        }else if(this.transaction > 0){
          transactionStr=" Deposit $"+this.transaction;
          if(this.transactionNote != ""){
            transactionStr+=" ("+this.transactionNote+")";
          }
          transactionStr+=".";
        }


        let response = await axios.put("/api/clients/" + selectedClient._id, {
          name: this.name,
          address: this.address,
          pin: this.pin,
          amount: Number(this.selectedClient.amount)+Number(this.transaction),
          history: this.selectedClient.history+transactionStr,
        });
        this.getClients();
        this.clearSelection();
        return true;
      } catch (error) {
        console.log(error);
      }

    },
    NOP(){

    },
  }
});
