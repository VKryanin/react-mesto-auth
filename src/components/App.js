import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { Main } from "./Main";
import { ImagePopup } from "./ImagePopup";
import { PopupEditAvatar } from "./PopupEditAvatar";
import { PopupEditProfile } from "./PopupEditProfile";
import { PopupAddCard } from "./PopupAddCard";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Footer } from "./Footer";
import { api } from "../utils/Api";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { ProtectedRoute } from "./ProtectedRoute";
import { InfoTooltip } from "./InfoTooltip";
import * as mestoAuth  from '../utils/MestoAuth'


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [waitingLoad, setWaitingLoad] = useState(true);
  const navigate = useNavigate();
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [successAuth, setSuccessAuth] = useState({
    message: '',
    selector: '',
  });

  useEffect(() => {
    Promise.all([api.getProfile(), api.getCards()])
      .then(([userData, cardData]) => {
        setCurrentUser(userData)
        setCards(cardData)
      })
      .catch((err) => { console.log(`Возникла глобальная ошибка, ${err}`) })
  }, [])

  // попап изм. аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }
  // попап изм профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }
  // попап доб. карточки
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }
  // удаление карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => { setCards((cardsArray) => cardsArray.filter((cardItem) => cardItem._id !== card._id)) })
      .catch((err) => { console.log(`Возникла ошибка при удалении карточки, ${err}`) })
  }
  // попап карточки
  function handleCardClick(cardData) {
    setIsImageOpen(true);
    setSelectedCard({
      ...selectedCard,
      name: cardData.name,
      link: cardData.link
    })
  }
  // лайк карточки
  function handleCardLike(card) {
    const isLiked = card.likes.some(cardItem => cardItem._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((cardsItem) => {
        setCards((state) => state.map((cardItem) => cardItem._id === card._id ? cardsItem : cardItem))
      })
      .catch((err) => { console.log(`Возникла ошибка при обработке лайков, ${err}`) })
  }

  // доб. карточки
  function handleAddCard(cardItem) {
    api.addNewCard(cardItem.name, cardItem.link)
      .then((card) => { setCards([card, ...cards]); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при добавлении новой карточки, ${err}`) })
  }
  // обн. пользователя
  function handleUpdateUser(userData) {
    api.patchUserData(userData.name, userData.about)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при редактировании профиля, ${err}`) })
  }
  // ред. аватара
  function handleUpdateAvatar(link) {
    api.patchUserPhoto(link)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при зименении аватара, ${err}`) })
  }
  // закрытие попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImageOpen(false);
  }

  const handleLogin = (inputValues) => {
    mestoAuth.authorize(inputValues)
    .then((res) => {
      localStorage.setItem('jwt', res.token);
      setLoggedIn(true);
    })
    .catch((err) => {
      setSuccessAuth({
        message: 'Что-то пошло не так! Попробуйте ещё раз.'
      });
      setIsInfoTooltipPopupOpen(true);
    });
  }

  function handleExit() {
    localStorage.clear()
    setLoggedIn(false)
  }

  const handleRegister = (inputValues) => {
    mestoAuth.register(inputValues)
    .then(()=> {
      setSuccessAuth({
        message: 'Вы успешно зарегистрировались!'
      });
      setIsInfoTooltipPopupOpen(true);
      navigate('/signin');
    })
    .catch((err) => {
      setSuccessAuth({
        message: 'Что-то пошло не так! Попробуйте ещё раз.'
      });
      setIsInfoTooltipPopupOpen(true);
    })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>

      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={
            <Link to="/signin" className="auth-forms__link" onClick={handleExit}>
              <p className="auth-forms__email">{currentUser.email}</p>
              <p className="auth-forms__email">Выйти</p>
            </Link>
          } />
          <Route path="signin" element={
            <Link to="/signup" className="auth-forms__link">
              Зарегистрироваться
            </Link>
          } />
          <Route path="signup" element={
            <Link to="/signin" className="auth-forms__link">
              Войти
            </Link>
          } />
        </Route>
      </Routes>

      <Routes>
        <Route path="/" element={!waitingLoad && <ProtectedRoute
          component={Main}
          loggedIn={loggedIn}
          handlers={{
            onEditProfile: handleEditProfileClick,
            handleAddCard: handleAddCard,
            onEditAvatar: handleEditAvatarClick,
            onCardClick: handleCardClick,
            onCardLike: handleCardLike,
            onCardDelete: handleCardDelete
          }}
          cards={cards}
        />}
        />
        <Route path="/signin" element={<Signin handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onRegister={handleRegister} />} />
        <Route path="*" element={loggedIn ? <Navigate to="/" /> : <Navigate to="/signin" />} />
      </Routes>
      <Footer />

      <PopupEditProfile isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
      <PopupAddCard isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddCard} />
      <PopupEditAvatar isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} success={successAuth} />

    </CurrentUserContext.Provider>
  )
}

export default App;