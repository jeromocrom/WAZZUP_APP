import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './src/App';

// Entry simple et robuste: PAS de HOC ici.
registerRootComponent(App);
