import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Dtable from './component/Dtable'
import Nav from './component/Nav'





import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {
  return (
    <div>
<BrowserRouter>

<Routes>
  <Route path='/' element={<Dtable/>}/>
  <Route path='Nav' element={<Nav/>}/>
 

  
</Routes>
</BrowserRouter>
    </div>
  );
}

export default App;
