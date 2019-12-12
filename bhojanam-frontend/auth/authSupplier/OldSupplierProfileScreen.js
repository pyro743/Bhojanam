import React, { Component } from 'react'
import PureChart from 'react-native-pure-chart';
import {View,Image,Modal,StyleSheet} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions,StackActions } from 'react-navigation';
import { Button,Input } from 'react-native-elements';
import {Container,Form,Content,Label,Item,Text,Fab,Icon} from 'native-base';
var jwt=AsyncStorage.getItem('jwts');
var id=AsyncStorage.getItem('ids');
export default class SupplierProfileScreen extends Component {
    static navigationOptions = ({title: "Your Profile",headerLeft: null})
    state = {
        modalVisible: false,
        name:"",
        active:false,
        email:"",
        mobile:"",
        password:"",
        address:"",
        noOfperson:"1",
        time: "",
        needyData:{data:[50],color:"blue",label:"Food Received"},
        orderData:{data:[100],color:"red",label:"Total Needy People"}
      };
    componentDidMount(){
      console.log(id,jwt);
      fetch('https://bhojanam-backend.herokuapp.com/orders/count',{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
      }).then((res)=>{return res.json()})
      .then((res)=>{console.log(res);this.setState({needyData:{data:[res],color:"red",label:"Total Needy People"}})})
      .catch((err)=>{console.log(err)})
      fetch('https://bhojanam-backend.herokuapp.com/needyPersons/count',{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
      }).then((res)=>{return res.json()})
      .then((res)=>{console.log(res);this.setState({needyData:{data:[res],color:"blue",label:"Food Received"}})})
      .catch((err)=>{console.log(err)})
      fetch('https://bhojanam-backend.herokuapp.com/suppliers/'+id._55,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization':"bearer "+jwt._55
        },
      }).then((res)=>{
        console.log(res);
        return res.json();
        })
        .then((result)=>{
          console.log(result);
          this.setState({
          name:result.name,
        email:result.email,
        mobile:result.mobile,
        password:result.password,
        address:result.address
        })
        })
        .catch((error)=>{alert("Error retreiving data")})
    }
      setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }
      home=()=>{
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Home'})
          ]
        })
        this.props.navigation.dispatch(resetAction)
      }
      donated=()=>{
        fetch('https://bhojanam-backend.herokuapp.com/orders',{
          method:"POST",
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':"bearer "+jwt._55
          },
          body:JSON.stringify({
            "supplier":id._55,
            "noOfPerson":parseInt(this.state.noOfperson)
          })
        }).then((res)=>{
          console.log(res);
          this.setModalVisible(false);
          alert("Thanks for donating!");
        })
        .catch((error)=>{console.log(error);alert(error);})
      }
    render() {
        return (
            <View style={{flex:1,backgroundColor:"#00CC00"}}>
                <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('You haven\'t donated anything!');
            this.setModalVisible(false);
          }}>
          <Container>
        <Content>
          <Form>
            <Item>
              <Label>Time</Label>
              <Input value={this.state.time} onChangeText={(val)=>{this.setState({time:val})}}/>
            </Item>
            <Item>
              <Label>Number Of persons</Label>
              <Input keyboardType="number-pad" value={this.state.noOfperson} onChangeText={(val)=>{this.setState({noOfperson:val})}}/>
            </Item>
            </Form>
            <Button buttonStyle={{backgroundColor:"green",marginTop:20,width:'50%',alignSelf:"center",borderRadius:20}} title="Donate" onPress={this.donated}/>
        </Content>
      </Container>
        </Modal>
                <View style={{flex:2,alignItems:"center"}}>
                <Image source={{uri:'https://institutogoldenprana.com.br/wp-content/uploads/2015/08/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg'}} style={styles.image}/>
                <Text style={styles.text}>{this.state.name}</Text>
                </View>
                <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                    <Button title="Donate Food" onPress={()=>{this.setModalVisible(true)}}/>
                </View>
            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center'}}>
            <PureChart color="blue" data={[this.state.needyData,this.state.orderData]} type='bar' height={100} width={"80%"} />   
           </View>
           <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
             <Button title="Logout" style={{backgroundColor:"#FC8019"}} onPress={this.home}/>
             <Fab
            active={this.state.active}
            direction="up"
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="share" />
            <Button style={{ backgroundColor: '#34A34F' }}>
              <Icon name="logo-whatsapp" />
            </Button>
            <Button style={{ backgroundColor: '#3B5998' }}>
              <Icon name="logo-facebook" />
            </Button>
            <Button disabled style={{ backgroundColor: '#DD5144' }}>
              <Icon name="mail" />
            </Button>
          </Fab>
           </View>
           </View>
        )
    }
}
const styles=StyleSheet.create({
  image:{
    height:80,
    width:80,
    marginTop:20,
    marginBottom:20,
    borderRadius: 40,
    borderWidth: 1
  },
  text:{
    flex:1,
    fontSize:30
  }
})
