# Software Engineer Backend Test

## Enunciado

Pi Skill Check

1. Desenvolver um sistema para cálculo distribuído do número irracional π (Pi).

2. Descrição: O cálculo será feito utilizando qualquer uma das séries disponíveis na literatura que aproximam Pi. Cada termo da série será obtido realizando uma requisição concorrente ou paralela a um servidor, passando o termo da série desejado. O servidor retornará o valor correspondente que deve ser somado ao acumulador. Note que quanto mais termos utilizar, mais preciso será o número. 

3. Comunicação entre a aplicação e o servidor deve ser feita via REST.

4. Criar também um endpoint REST para exibir o número já calculado e até qual termo da série foi somado para obter aquele valor.

## Rodando a Aplicação

Após clonar o repositório:

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
