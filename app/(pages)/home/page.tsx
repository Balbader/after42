import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import Hero from '@/components/pages/home/Hero';
import ModularSolutions from '@/components/pages/home/ModularSolutions';
import HowItWorks from '@/components/pages/home/HowItWorks';
import CustomerStories from '@/components/pages/home/CustomerStories';
import BuiltForGrowth from '@/components/pages/home/BuiltForGrowth';
import DesignedForDevelopers from '@/components/pages/home/DesignedForDevelopers';
import LaunchWithEase from '@/components/pages/home/LaunchWithEase';

export default function HomePage() {
	return (
		<>
			<Header />
			<Hero />
			<ModularSolutions />
			<HowItWorks />
			<CustomerStories />
			<BuiltForGrowth />
			<DesignedForDevelopers />
			<LaunchWithEase />
			<Footer />
		</>
	);
}
