import Error from './error';
import Toast from './toast';
import Success from './success';
import Warning from './warning';
import Loading from './loading';

Toast.Error = Error;
Toast.Success = Success;
Toast.Warning = Warning;
Toast.Loading = Loading;

console.log('hello====================================',Toast.Success)

export default Toast;