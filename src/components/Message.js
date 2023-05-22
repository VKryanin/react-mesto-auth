
import close from '../images/Close.svg';
import fail from '../images/fail.svg';
import succsess from '../images/Union.svg';
import { useState } from 'react';

export function Message({ status: status, styles: style, error: error }) {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    }

    if (!isOpen) {
        return null;
    }
    if (status) {
        return (
            <div style={style} className='message'>
                <div className="message__popup">
                    <img src={succsess} alt="Успех" />
                    <p>Вы успешно зарегистрировались!</p>
                    <img onClick={handleClose} src={close} alt="close" />
                </div>
            </div>
        )
    } else {
        return (
            <div style={style} className="message">
                <div className='message__bg'></div>
                <div className="message__popup">
                    <img src={fail} alt="Не удачно" />
                    <p>{error}</p>
                    <img onClick={handleClose} className='message__close' src={close} alt="close" />
                </div>
            </div>
        )
    }

}