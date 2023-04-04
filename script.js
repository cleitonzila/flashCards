class Card {
    constructor(question, answer){
        this.question = question
        this.answer = answer
        this.point = 50
    }

    increasePoints() {
        if(this.point < 100){
            this.point++
        }
    }

    decreasePoints() {
        if(this.point > 0){
            this.point--
        }
    }
}

class Deck {
    constructor(cardList){
        this.cardList = cardList
    }

    getNextCard() {
        const card = this.cardList.shift(); // remove and return the first card
        this.cardList.push(card); // add the card to the end of the deck
        return card;
    }

    addCard(card) {
        this.cardList.push(card)
    }

    shuffle() {
        for (let i = this.cardList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.cardList[i], this.cardList[j]] = [this.cardList[j], this.cardList[i]];
        }
    }

    reset() {
        for (const card of this.cardList) {
          card.point = 50; // reset point value to default
        }
        this.shuffle(); // shuffle the deck again
    }
    
}

const deck = new Deck([])
fetch('questionList.json')
  .then(response => response.json())
  .then(data => {
    deck.cardList = data.map(
        cardData => new Card(cardData.question, cardData.answer)
    );
    deck.shuffle();
    showQuestion(); // call showQuestion() after loading the data
  })
  .catch(error => console.error(error));

const showQuestion = () => {
    const questionEl = document.getElementById('question')
    const answerEl = document.getElementById('answer') // get answer element
    const btnDiv = document.getElementById('btn-conteiner')
    const cards = deck.cardList
    questionEl.innerText = ''
    answerEl.innerText = '' // clear answer element
    btnDiv.innerHTML = '' // clear the button container
    if (cards.length > 0) {
        const currentCard = cards[0]
        const questionTxt = document.createElement('p')
        const btnEl = document.createElement('button')
        questionTxt.innerText = `${currentCard.question}`
        btnEl.innerText = 'Resposta'
        btnEl.onclick = () => {
            showAnswer()
            if (btnEl.parentNode) { // check if btnEl has a parent node
                btnEl.parentNode.removeChild(btnEl)
            }
        }
        questionEl.append(questionTxt)
        btnDiv.append(btnEl)
    } else {
        questionEl.innerText = 'No cards in deck. Please add cards to deck.'
    }
}

const showAnswer = () => {
    const answerEl = document.getElementById('answer')
    const btnDiv = document.getElementById('btn-conteiner')
    const cards = deck.cardList
    answerEl.innerText = ''
    btnDiv.innerHTML = '' // clear the button container
    if (cards.length > 0) {
        const currentCard = cards[0]
        const answerTxt = document.createElement('p')
        const btnElGod = document.createElement('button')
        const btnElBad = document.createElement('button')
        btnElGod.onclick = () => {
            currentCard.increasePoints()
            console.log(currentCard.point)
            deck.getNextCard()
            showQuestion()
        }
        btnElGod.innerText = 'Acertei'
        btnElBad.onclick = () => {
            currentCard.decreasePoints()
            console.log(currentCard.point)
            deck.addCard(currentCard)
            deck.getNextCard()
            showQuestion()
        }
        btnElBad.innerText = 'Errei'
        answerTxt.innerText = `${currentCard.answer}`
        answerEl.append(answerTxt)
        btnDiv.append(btnElGod)
        btnDiv.append(btnElBad)
    }
}

const replay = () => {
    deck.reset(); // reset the deck
    showQuestion(); // start a new round
}