import logo from '../images/header__logo.svg'

export function Header() {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt='Лого "Mesto Russia"' />
        </header>
    )
}