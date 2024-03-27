/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(customerSuccess, customers, customerSuccessAway) {
  // Filtrando os CSs disponíveis
  const availableCS = customerSuccess.filter(cs => !customerSuccessAway.includes(cs.id));
  
  // Ordenando os CSs disponíveis por nível de experiência do menor para o maior
  availableCS.sort((a, b) => a.score - b.score);
  
  // Ordenando os clientes por tamanho do menor para o maior
  customers.sort((a, b) => a.score - b.score);
  
  // Inicializando contadores
  let csIndex = 0;
  let customerIndex = 0;
  let maxCustomers = 0;
  let maxCustomersCS = 0;
  
  // Distribuindo clientes para os CSs disponíveis
  while (csIndex < availableCS.length && customerIndex < customers.length) {
    const cs = availableCS[csIndex];
    const customer = customers[customerIndex];
    
    if (customer.score <= cs.score) {
      // Se o cliente pode ser atendido pelo CS atual, incrementa o contador de clientes atendidos pelo CS
      cs.customersOk = (cs.customersOk || 0) + 1;
      customerIndex++;
    } else {
      // Se o cliente não pode ser atendido pelo CS atual, avança para o próximo CS disponível
      csIndex++;
    }
    
    // Atualiza o máximo de clientes atendidos por um CS e o ID do CS correspondente
    if ((cs.customersOk || 0) > maxCustomers) {
      maxCustomers = cs.customersOk;
      maxCustomersCS = cs.id;
    }
  }
  
  // Verificando se há empate
  const isTie = availableCS.some(cs => (cs.customersOk || 0) === maxCustomers && cs.id !== maxCustomersCS);
  
  // Retornando o ID do CS que atende mais clientes ou 0 em caso de empate
  return isTie ? 0 : maxCustomersCS;
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});
