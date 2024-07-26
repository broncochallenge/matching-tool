import { FormEvent, useState } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { GetProps, Input, Modal, message } from "antd";
import Spinner from "../Components/Spinner";
import { generateToken, loginWithToken } from "../firebase/functions";
import EntryList from "../Components/EntryList";

export default function MatchinToolHome() {
  type OTPProps = GetProps<typeof Input.OTP>;
  const [loading, setLoading] = useState(false);
  const [gettingToken, setGettingToken] = useState(false);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const navigate = useNavigate();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const onChange: OTPProps["onChange"] = (text) => {
    setToken(text);
  };

  const sharedProps: OTPProps = {
    onChange,
    size: "large",
  };

  return (
    <div className="dark:bg-gray-800 min-h-screen">
      <Navbar />
      <section className="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-wmu_gold bg-blend-multiply">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            Find Your Perfect Team for the Bronco Challenge
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
            Connect with peers, collaborate on sustainability projects, and make
            a lasting impact.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
            <button
              onClick={showModal}
              className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
            >
              Find Team Members
            </button>
            <button
              onClick={() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }}
              className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
            >
              Join a Team
            </button>
          </div>
        </div>
      </section>
      <Modal
        open={open}
        title="Login with one-time password (OTP)"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <form onSubmit={onSubmitForm} className=" ">
          <div className="mb-2">
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your WMU Email
            </label>
            <input
              type="text"
              autoComplete="given-name"
              id="fullName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              placeholder="firstname.lastname@wmich.edu"
              required
              onChange={(e) => {
                setYourEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="teamName"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Enter OTP
            </label>
            <Input.OTP length={6} {...sharedProps} />
          </div>
          <div className="mb-2 flex ">
            <button
              type="button"
              onClick={async () => {
                if (!yourEmail) return message.warning("Email is required.");
                if (!token) return message.warning("OTP is required.");
                setLoading(true);
                await loginWithToken(token, yourEmail)
                  .finally(() => {
                    setLoading(false);
                  })
                  .then((response) => {
                    if (response) {
                      navigate(`/find-team-members?token=${token}`);
                    }
                  });
              }}
              className=" flex gap-x-3 justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Login {loading && <Spinner />}
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!yourEmail) return message.warning("Email is required.");
                setGettingToken(true);
                await generateToken(yourEmail).finally(() => {
                  setGettingToken(false);
                });
              }}
              className=" flex gap-x-3 justify-center items-center py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
            >
              Get OTP {gettingToken && <Spinner />}
            </button>
          </div>
        </form>
      </Modal>
      <div id="entryList">
        <EntryList />
      </div>
      <Footer />
    </div>
  );
}
