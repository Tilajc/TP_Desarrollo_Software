export const getRandomInt = (quantity) => {
  return Math.floor(Math.random() * quantity);
};

export const getRandomCharacters = (quantity) => {
  let randomWord = '';

  for (let i = 0; i < quantity; i++) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const randomPosition = getRandomInt(charactersLength);

    randomWord += characters[randomPosition];
  }

  return randomWord;
};
