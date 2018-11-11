import React, { Component } from 'react';
import _ from 'lodash';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

require('dotenv').config();
let copyData = [];
class App extends Component
{
  constructor(props){
    super(props);
    this.state = {
      stateArray: ["MUMBAI", "BANGALORE", "CHENNAI","DELHI","KOLKATA", "PATNA"],
      cityData: [],
      copyData: [],
      text: null,
      loading: false
    }
  }

  selectedCity(e){

    if(e.target.value==="0"){
      return;
    }
    else{
      this.setState({loading: true});
      fetch('https://vast-shore-74260.herokuapp.com/banks?city='+e.target.value, {
        method: 'GET'
      })
      .then(res => (res.json()))
      .then(res => {
        console.log("res", res);
        this.setState({cityData: res, copyData: res, loading: false});
        copyData = res;
        
      })
      .catch(err => {
        console.log("err", err);
      })
    }
    
  }

  searchText(){
    this.setState({loading: true, cityData: this.state.copyData})
    console.log("this0000", this.text.value);
    
    let filter_by_id = _.filter(copyData, (arr, index) => (arr.bank_id===Number(this.text.value)));
    
    let filter_by_ifsc = _.filter(copyData, (arr, index) => (
      arr.ifsc.search(this.text.value.toUpperCase())>-1
    ));

    //let filter_by_bank_name = _.filter(this.state.cityData, (arr, index) => (arr.bank_name === this.text.value.toUpperCase()));
    let filter_by_bank_name = _.filter(copyData, (arr, index) => (
      arr.bank_name.search(this.text.value.toUpperCase())>-1
      
    ));

    let filter_by_state = _.filter(copyData, (arr, index) => (
      //arr.state === this.text.value.toUpperCase()
      arr.state.search(this.text.value.toUpperCase())>-1
    ));

    let filter_by_city = _.filter(copyData, (arr, index) => (
      //arr.city === this.text.value.toUpperCase()
      arr.city.search(this.text.value.toUpperCase())>-1
    ));

    let filter_by_district = _.filter(copyData, (arr, index) => (
      //arr.district === this.text.value.toUpperCase()
      arr.district.search(this.text.value.toUpperCase())>-1
    ));

    let filter_by_address = _.filter(copyData, (arr, index) => (
      arr.address.search(this.text.value.toUpperCase())>-1
     // arr.address === this.text.value.toUpperCase()
    ));

    filter_by_ifsc = filter_by_ifsc.concat(filter_by_id);
    filter_by_bank_name = filter_by_bank_name.concat(filter_by_ifsc);
    filter_by_state = filter_by_state.concat(filter_by_bank_name);
    filter_by_city = filter_by_city.concat(filter_by_state);
    filter_by_district = filter_by_district.concat(filter_by_city);
    filter_by_address = filter_by_address.concat(filter_by_district);
    let uniq = _.uniq(filter_by_address, 'ifsc');
    this.setState({cityData: uniq, loading: false})

  }
  setSearch(e){
    this.setState({text: this.text.value})
  }

  render()
  {
    return (
      <div>
        <select onChange={this.selectedCity.bind(this)}>
          <option key="0">--select city--</option>
          {
            _.map(this.state.stateArray, (city, index) => (
              
              <option key={city}>{city}</option>
            ))
          }
        </select>
        <input type="text" placeholder="Search ... "  ref={(e) => this.text = e} />
        <button onClick={this.searchText.bind(this)}>search</button>
        {
          (this.state.loading)
            ?
          "Loading ... Please wait"
            :
          <BootstrapTable data={this.state.cityData} striped={true} hover={true} ref='table'>
            <TableHeaderColumn dataField="bank_id" isKey={true}  width='50px' headerAlign='center' dataAlign='center' hidden={false} export={false} searchable={false}>Bank ID</TableHeaderColumn>
            <TableHeaderColumn dataField="ifsc" hidden={false}  width='220px' headerAlign='left' dataAlign='center' export={false} searchable={false}>IFSC Code</TableHeaderColumn>
            <TableHeaderColumn dataField="bank_name"  hidden={false}  width='450px' headerAlign='left' dataAlign='left' export={false} searchable={false}>Bank Name</TableHeaderColumn>
            <TableHeaderColumn dataField="state"  hidden={false}  width='280px' headerAlign='center' dataAlign='center' export={false} searchable={false}>State</TableHeaderColumn>
            <TableHeaderColumn dataField="city" hidden={false}  width='350px' headerAlign='left' dataAlign='center' export={false} searchable={false}>City</TableHeaderColumn>
            <TableHeaderColumn dataField="district"  hidden={false}  width='320px' headerAlign='left' dataAlign='center' export={false} searchable={false}>District</TableHeaderColumn>
            <TableHeaderColumn dataField="address"  hidden={false}  width='120px' headerAlign='left' dataAlign='left' export={false} searchable={false}>Address</TableHeaderColumn>
          </BootstrapTable>
        
        }
       
      </div>
    );
  }
}

export default App;
