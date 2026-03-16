import Loading from "@workspace/ui/blocks/loading/loading";
import { Button } from "@workspace/ui/components/button";

const SubmitButton = ({
  submitText = "submit",
  loadingText = "Loading...",
  isLoading,
  id,
}: {
  disabled?: boolean;
  isLoading: boolean;
  submitText: string;
  loadingText: string;
  id?: string;
}) => {
  return (
    <Button
      id={id}
      disabled={isLoading}
      type="submit"
      className="transition-all w-full duration-300 transform hover:scale-100 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
    >
      {isLoading ? (
        <div className="gap-1 flex items-center">
          <Loading width={30} height={30} />
          {loadingText}
        </div>
      ) : (
        submitText
      )}
    </Button>
  );
};

export default SubmitButton;
