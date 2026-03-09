import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Register from './pages/Register'
import Success from './pages/Success'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/success" element={<Success />} />
                <Route path="/admin/:token" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    )
}
