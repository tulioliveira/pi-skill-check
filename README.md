# TrackSale's Software Engineer Backend Test

## Serving the Application

After cloning the repository:

```bash
npm install --only=production
npm run serve
```

## API

|   Recurso   | Método |    Endpoint   |                                                            Descrição                                                            |
|:-----------:|:------:|:-------------:|:-------------------------------------------------------------------------------------------------------------------------------:|
| GetAllTerms |   GET  |     /terms    |                                          Retorna todos os termos da série já calculados                                         |
|   GetTerm   |   GET  | /terms/:index | Retorna o termo da série definido pelo índice passado como argumento, acumulando seu valor caso ainda não tenha sido calculado. |
|    GetPi    |   GET  |      /pi      |                 Retorna o valor atual acumulado em Pi, bem como os termos utilizados alcançar essa aproximação.                 |