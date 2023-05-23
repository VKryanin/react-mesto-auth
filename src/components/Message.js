
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
        return (
            <div style={style} className="message">
              <div className="message__popup">
                <img
                  src={status ? succsess : fail}
                  alt={status ? "Успех" : "Не удачно"}
                />
                <p>{status ? "Вы успешно зарегистрировались!" : error}</p>
                <img className='message__close' onClick={handleClose} src={close} alt="close" />
              </div>
            </div>
          ); 
    } 
