import Header from '@/components/navigation/Header';
import Hero from '@/components/pages/home/Hero';
import PainPoints from '@/components/pages/home/PainPoints';
import SolutionOne from '@/components/pages/home/SolutionOne';
import HowItWorks from '@/components/pages/home/HowItWorks';

export default function HomePage() {
	return (
		<>
			<Header />
			<Hero />
			<HowItWorks />
			<PainPoints />
			<SolutionOne />
		</>
	);
}
