import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/home';
import Setting from '../screens/setting';
import Tester from '../screens/tester';
import HomePayment from '../screens/Payment/homePayment';
import Payment from '../screens/Payment/payment';

const Stack = createStackNavigator();


const RootNavigation=() =>{
  return (
    <Stack.Navigator 
    screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name='HomePayment' component={HomePayment}/>
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name='Tester' component={Tester}/>
      <Stack.Screen name='Payment' component={Payment}/>
    </Stack.Navigator>
  );
}
export default RootNavigation