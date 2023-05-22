import logo from '../images/header__logo.svg'

export function Header({handleEvent: click, title: title}) {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt='Лого "Mesto Russia"' />
            <div className='header__container'>
                <h3 className='header__user'>{localStorage.getItem('user')}</h3>
                <button className='header__button' onClick={click}>{title}</button>
            </div>

        </header>
    )
}