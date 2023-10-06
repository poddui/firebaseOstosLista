import { StyleSheet, Text, View, Button, FlatList, TextInput, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { push, ref, onValue, remove} from 'firebase/database';
import database from './firebase';


export default function App() {
  
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shopList, setShopList] = useState([]);

  
  useEffect(() => {
    console.log("useffect")
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const products = data ? Object.keys(data).map(key => ( {key, ...data[key]})) : [];
      setShopList(products);
    })
  }, []);

  const saveItem = () => {
    push(ref(database, 'items/'), {'product': product, 'amount': amount});
    setProduct('');
    setAmount('');
    Keyboard.dismiss();
  }

  const deleteItem = (key) => {
    remove(ref(database, 'items/' + key));
  };    

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>     
      <Button onPress={saveItem} title="Add" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping List</Text>
      <FlatList
        style={{marginLeft : "5%"}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text>{item.product},  {item.amount} </Text>
            <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.key)}>Delete</Text>
          </View>}
        data={shopList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
  },
  listcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
  },
});