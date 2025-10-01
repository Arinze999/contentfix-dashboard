import SignOutButton from '@/components/buttons/SignOutButton';
import CompanyLogo from '@/components/CompanyLogo';
import Welcome from '@/components/welcome/Welcome';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="default-margin h-full relative col-center">
        <div className="sticky z-[5] left-0 top-0 py-5 w-full flex-between bg-dark">
          <CompanyLogo white />
          <SignOutButton open />
        </div>

        <div className="h-[calc(100dvh-6.5rem)] md:h-[calc(100dvh-5rem)] py-6">
          <Welcome />
        </div>
      </div>
    </div>
  );
}
