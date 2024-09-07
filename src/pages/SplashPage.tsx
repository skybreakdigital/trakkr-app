import logo from '../../logo.png';

function SplashPage() {
    return (
        <div className="SplashPage w-full h-21rem flex flex-column justify-content-center align-items-center">
            <img src={logo} className="w-8" />
            <div style={{ letterSpacing: '3px', marginTop: '-15px', marginLeft: '1.5rem'}}>

                <div className="uppercase text-xs font-bold">by Dkter Roc</div>
            </div>
            
        </div>
    )
}

export default SplashPage;