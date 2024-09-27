# Clash Royale API

# Atividade:

1. Calcule a porcentagem de vitórias e derrotas utilizando a carta X(parâmetro) ocorridas em um intervalo de timestamps (parâmetro).
2. Liste os decks completos que produziram mais de X% (parâmetro) de vitórias ocorridas em um intervalo de timestamps (parâmetro).
3. Calcule a quantidade de derrotas utilizando o combo de cartas(X1,X2, ...) (parâmetro) ocorridas em um intervalo de timestamps (parâmetro).
4. Calcule a quantidade de vitórias envolvendo a carta X (parâmetro) nos casos em que o vencedor possui Z% (parâmetro) menos troféus do que o perdedor, a partida durou menos de 2 minutos, e o perdedor derrubou ao menos duas torres do adversário.
5. Liste o combo de cartas (eg: carta 1, carta 2, carta 3... carta n) de tamanho N (parâmetro) que produziram mais de Y% (parâmetro) de vitórias ocorridas em um intervalo de timestamps (parâmetros).
6. Elabore mais 3 consultas que você julga relevante para auxiliar no balanceamento do jogo.

# Exemplos de Consultas:

1. http://localhost:3000/players/%TAGDOJOGADORREAL
2. http://localhost:3000/queries/top-players-by-wins?startTime=2023-01-01&endTime=2023-12-31
3. 

# Exemplo de Post:

## URL: http://localhost:3000/battles

[
  {
    "timestamp": "2024-09-24T22:02:17.000Z",
    "player1": "Player1Tag",
    "player2": "Player2Tag",
    "player1Towers": 3,
    "player2Towers": 1,
    "winner": "Player1Tag",
    "player1Deck": ["Card1", "Card2", "Card3"],
    "player2Deck": ["Card4", "Card5", "Card6"],
    "player1Trophies": 6000,
    "player2Trophies": 5000,
    "winnerDeck": ["Card1", "Card2", "Card3"]
  }

### Observação:

Utilizar o postman para as consultas (METHOD GET) e a inserção dos dados (METHOD POST)

## Alunos:

Débora Freitas
João Pedro Brito
Juan Henrique
Yago Xavier
