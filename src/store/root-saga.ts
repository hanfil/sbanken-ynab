import { fork } from 'redux-saga/effects';
import { History } from 'history';
import accountsSaga from '../accounts/saga';
import appSaga from '../app/saga';
import onboardingSaga from '../onboarding/saga';
import sbankenSaga from '../sbanken/saga';
import ynabSaga from '../ynab/saga';

export default function* rootSaga(history: History) {
  yield fork(accountsSaga, history);
  yield fork(appSaga);
  yield fork(onboardingSaga, history);
  yield fork(sbankenSaga);
  yield fork(ynabSaga);
}
