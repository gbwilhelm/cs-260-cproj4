var app = new Vue({
  el: '#app',
  created() {
    this.getClients();
  },
  data: {
    viewFlag: false,
    name:"",
    address:"",
    pin:"",
    amount:0,
    transaction:0,
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
        try{
          Number(this.pin);
        }catch(err){
          window.alert("The PIN can only contain numbers and must be 4 digits");
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
      try {
        let transactionStr ="";
        if(this.transaction < 0){
          transactionStr=" Withdrawl $"+this.transaction+" ."
          //check if exceeds current balance
        }else if(this.transaction > 0){
          transactionStr=" Deposit $"+this.transaction+" ."
        }

        let response = await axios.put("/api/clients/" + selectedClient._id, {
          name: this.selectedClient.name,
          address: this.selectedClient.address,
          pin: this.selectedClient.pin,
          amount: Number(this.selectedClient.amount)+this.transaction,
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
