const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('index', { error: null, a: '', b: '', op: 'sum' });
});

router.post('/calcular', (req, res) => {
  const { a, b, op } = req.body;

  const aNum = Number(a);
  const bNum = Number(b);
  if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
    return res.render('index', { error: 'Ingresa núnmeros validos', a, b, op });
  }

  let resultado;
  switch (op) {
    case 'sum': resultado = aNum + bNum; break;
    case 'sub': resultado = aNum - bNum; break;
    case 'mul': resultado = aNum * bNum; break;
    case 'div':
      if (bNum === 0) {
        return res.render('index', { error: 'Division por cero no es posible', a, b, op });

      }
      resultado = aNum / bNum; 
      break;
    default: 
    return res.render('index', { error: 'Operación invalida', a, b, op })
  }

  res.render('result', { a: aNum, b: bNum, op, resultado });
});

module.exports = router;