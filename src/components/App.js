import React, { useEffect } from "react";
import Content from "./Content";
import { Header } from "./Header";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { ProtectedRoute } from "./ProtectedRoute";
import { useState } from "react";


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = () => {
    setLoggedIn(true);
  }

  function handleExit() {
    localStorage.clear()
    setLoggedIn(false)
  }



  return (
    <>
      <Routes>
        <Route path="/content" element={<Header handleEvent={handleExit} title={'Выход'} />} />
        <Route path="/sign-up" element={<Header handleEvent={() => { navigate('/sign-in') }} title={'Войти'} />} />
        <Route path="/sign-in" element={<Header handleEvent={() => { navigate('/sign-up') }} title={'Регистрация'} />} />
      </Routes>
      <Routes>
        <Route path="/content" element={<ProtectedRoute element={Content} loggedIn={loggedIn} />} />
        <Route path="/sign-in" element={
          <div className="authForm">
            <Signin handleLogin={handleLogin} />
          </div>} />
        <Route path="/sign-up" element={
          <div className="authForm">
            <Signup />
          </div>} />
        <Route path="/" element={loggedIn ? <Navigate to='/content' /> : <Navigate to='/sign-in' replace />} />
      </Routes>
    </>
  )
}

export default App;