import './App.scss';
import AppControl from './components/AppControl';

function App() {
  return (
    <div>
      <header className="p-3 bg-dark text-white app-header">
        <div className="container">
          <div className="app-title text-light fs-4 text-uppercase fw-bold">UBC Timetable</div>
        </div>
      </header>

      <AppControl />
    </div>
  );
}

export default App;
