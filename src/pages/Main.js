import { useRouter } from 'next/router';
import Main from '../components/Main';

const MainPage = () => {
  const router = useRouter();
  const { date } = router.query;

  return <Main date={date} />;
};

export default MainPage;