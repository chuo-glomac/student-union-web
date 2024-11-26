"use client";
import { useState } from "react";
import { Field } from "@/components/form";
import { useRouter } from "next/navigation";
import { getUrl } from "@/utils/getUrl";
import { SubmitButton } from "@/components/submitButton";

import { useParams } from "next/navigation";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2);
  const [japan, setJapan] = useState<boolean>(true);
  const [remember, setRemember] = useState(false);
  const [codeError, setCodeError] = useState("");

  const [letter, setLetter] = useState(true);
  const [agreement, setAgreement] = useState(false);

  const params = useParams<{ params_id: string; params_email: string }>();
  const params_id = decodeURIComponent(params.params_id);
  const params_email = decodeURIComponent(params.params_email);
  // const searchParams = useSearchParams();
  // const params_id = searchParams.get("id");
  // const params_email = searchParams.get("email");

  const handleMemberInfo = async (formData: FormData) => {
    try {
      //  console.log(formData.get("newsLetter"));
      let alert_pass_error = "";
      const password = formData.get("password") as string;
      const passwordConf = formData.get("password-confirm") as string;

      if (password != passwordConf) {
        if (japan) {
          alert_pass_error = "「パスワードの確認」が不正です。";
        } else {
          alert_pass_error = "Verification code is incorrect.";
        }
        alert(alert_pass_error);

        return;
      }

      if (!formData.get("country")) {
        if (japan) {
          alert_pass_error =
            "国籍を選択してください。\nYou can select International Student if the county is not on the list.";
        } else {
          alert_pass_error = "Please select your nationality.";
        }
        alert(alert_pass_error);

        return;
      }

      let formList = "";
      if (japan) {
        formList = `
        ！送信前に内容をご確認ください！

        氏名: ${formData.get("familyName-kanji")} ${
          formData.get("middleName-kanji")
            ? `${formData.get("middleName-kanji")} `
            : ""
        }${formData.get("givenName-kanji")}
        氏名（ローマ字）: ${formData.get("familyName")} ${
          formData.get("middleName") ? `${formData.get("middleName")} ` : ""
        }${formData.get("givenName")}
        氏名（フリガナ）: ${formData.get("familyName-pho")} ${
          formData.get("middleName-pho")
            ? `${formData.get("middleName-pho")} `
            : ""
        }${formData.get("givenName-pho")}

        生年月日: ${formData.get("birthOfDate")}
        国籍: ${formData.get("country")}

        電話番号: ${formData.get("phone")}
        `;
      } else {
        formList = `
        !please confirm to send form!

        Name (Alphabet): ${formData.get("familyName")} ${formData.get(
          "givenName"
        )}
        Name (Hiragana): ${formData.get("familyName-pho")} ${formData.get(
          "givenName-pho"
        )}

        Birth of Date: ${formData.get("birthOfDate")}
        Nationality: ${formData.get("country")}

        Phone Number: ${formData.get("phone")}
        `;
      }
      const check = confirm(formList);

      if (check) {
        const formObject: { [key: string]: any } = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });

        const response = await fetch("/api/registration/01_memberInfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: params_email,
            temporaryId: params_id,
            formData: formObject,
          }),
        });
        const data = await response.json()
        console.log(data);
        if (data && data.ok === false) {
          alert(data.message);
          return
        }

        setPage(2);
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleSendCode = async (formData: FormData) => {
    try {
      const studentNo = formData.get("student-no") as string;
      const studentEmail = formData.get("student-email") as string;

      if (studentNo.substring(0, 2) != studentEmail.substring(1, 3)) {
        let alert_email_validate = "";
        if (japan) {
          alert_email_validate = "学籍番号と大学メールが誤りです。";
        } else {
          alert_email_validate =
            "Please check Student ID and University Email.";
        }
        alert(alert_email_validate);
        return;
      }

      //   await sendCode(formData);
      const response = await fetch("/api/registration/02_sendCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: params_email,
          temporaryId: params_id,
          universityId: "chuo-university",
          departmentId: 1,
          studentNo,
          studentEmail,
        }),
      });
      const data = await response.json()
      console.log(data);

      if (data && data.ok === false) {
        if (japan) {
          alert("認証コードを作成できませんでした。再度お試しください。");
        } else {
          alert("Cannot create verification code. Please try again.");
        }
        return;
      }

      let alert_code_sent = "";
      if (japan) {
        alert_code_sent = "認証コードが大学メールに送信されました。";
      } else {
        alert_code_sent = "Verification code sent to your University Email.";
      }
      alert(alert_code_sent);

      setPage(3);
    } catch (err) {
      alert(err);
    }
  };

  const handleVerifyCode = async (formData: FormData) => {
    setIsLoading(true);
    setCodeError("");

    try {
      console.log(formData);
      const code = formData.get("verification-code") as string;

      const response = await fetch("/api/registration/03_confirmCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: params_email,
          temporaryId: params_id,
          code,
        }),
      });
      // console.log(response);
      const data = await response.json()
      console.log(data);

      if (data && data.ok === false) {
        console.log(data.message);
        if (japan) {
          setCodeError("コードが間違っています");
        } else {
          setCodeError("Code does not match.");
        }
      }

      let alert_complete = "";
      if (japan) {
        alert_complete = `
        ！登録が完了しました！
        個人メール宛にDiscordの招待リンクが送信されました。

        ※迷惑メールに登録されている場合があります
        `;
      } else {
        alert_complete = `
          !Registration Completed!
          Invite link for Discord is sent to your Private Email.
        `;
      }
      alert(alert_complete);

    } catch (err) {
      alert(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white text-black">
      <div className="group max-w-2xl w-full flex flex-col">
        <div className="text-2xl font-medium mb-8">
          Student Union (Page: {page})
          {/* <p className="text-lg font-normal">params_id: {params_id}</p> */}
          <p className="text-lg font-normal">Email: {params_email}</p>
        </div>

        <form className="group max-w-2xl w-full flex flex-col">
          {page == 1 && (
            <div>
              <div className="mb-8 flex flex-row gap-4">
                <div
                  onClick={() => {
                    setJapan(true);
                  }}
                  className={`flex w-full justify-center rounded-md border border-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 shadow-sm hover:bg-indigo-100 ${
                    japan
                      ? "bg-indigo-600 text-white hover:bg-indigo-600 cursor-default"
                      : "cursor-pointer"
                  }`}
                >
                  日本人学生
                </div>
                <div
                  onClick={() => {
                    setJapan(false);
                  }}
                  className={`flex w-full justify-center rounded-md border border-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 shadow-sm hover:bg-indigo-100 ${
                    !japan
                      ? "bg-indigo-600 text-white hover:bg-indigo-600 cursor-pointer"
                      : "cursor-pointer"
                  }`}
                >
                  Non-Japanese Student
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Field
                  type="text"
                  pattern="[A-Z][a-z]+"
                  name="familyName"
                  label="Family Name | 姓（ローマ字）"
                  placeholder="Smith"
                  required={true}
                />
                <Field
                  type="text"
                  pattern="[A-Z][A-Za-z\s]+"
                  name="givenName"
                  label="Given Name | 名（ローマ字）"
                  placeholder="David"
                  required={true}
                />
              </div>
              {remember && (
                <Field
                  type="text"
                  name="middleName"
                  label="Middle Name | ミドルネーム（ローマ字）"
                  placeholder=""
                  required={true}
                />
              )}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-600"
                    required
                  />
                </div>
                <label htmlFor="remember" className="ms-2 text-sm">
                  Set middle name. ミドルネームを設定する。
                </label>
              </div>
              <div className="h-6" />
              {japan && (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Field
                      type="text"
                      name="familyName-kanji"
                      label="Family Name (Kanji) | 姓"
                      placeholder="山田"
                      required={true}
                    />
                    <Field
                      type="text"
                      name="givenName-kanji"
                      label="Given Name (Kanji) | 名"
                      placeholder="太郎"
                      required={true}
                    />
                  </div>
                  {remember && (
                    <Field
                      type="text"
                      name="middleName-kanji"
                      label="Middle Name (Kanji) | ミドルネーム"
                      placeholder=""
                      required={true}
                    />
                  )}
                  <div className="h-6" />
                </>
              )}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Field
                  type="text"
                  pattern="[ァ-ンー]*"
                  name="familyName-pho"
                  label="Family Name (Katakana) | 姓（フリガナ）"
                  placeholder="ヤマダ"
                  required={true}
                />
                <Field
                  type="text"
                  pattern="[ァ-ンー]*"
                  name="givenName-pho"
                  label="Given Name (Katakana) | 名（フリガナ）"
                  placeholder="タロウ"
                  required={true}
                />
              </div>
              {remember && (
                <Field
                  type="text"
                  name="middleName-pho"
                  label="Middle Name (Katakana) | ミドルネーム（フリガナ）"
                  placeholder=""
                  required={true}
                />
              )}
              <div className="h-6" />
              <Field
                type="date"
                name="birthOfDate"
                label="Birth of Date | 生年月日"
                required={true}
              />
              <div className="mb-6">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  国籍 | Nationality<span className="text-red-600"> *</span>
                </label>
                <select
                  name="country"
                  id="country"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                >
                  <option value="" hidden>
                    Nationality
                  </option>
                  {japan ? (
                    <option>Japan</option>
                  ) : (
                    <>
                      <option>Afghanistan</option>
                      <option>Albania</option>
                      <option>Algeria</option>
                      <option>Andorra</option>
                      <option>Angola</option>
                      <option>Antigua and Barbuda</option>
                      <option>Argentina</option>
                      <option>Armenia</option>
                      <option>Australia</option>
                      <option>Austria</option>
                      <option>Azerbaijan</option>
                      <option>Bahamas</option>
                      <option>Bahrain</option>
                      <option>Bangladesh</option>
                      <option>Barbados</option>
                      <option>Belarus</option>
                      <option>Belgium</option>
                      <option>Belize</option>
                      <option>Benin</option>
                      <option>Bhutan</option>
                      <option>Bolivia</option>
                      <option>Bosnia and Herzegovina</option>
                      <option>Botswana</option>
                      <option>Brazil</option>
                      <option>Brunei</option>
                      <option>Bulgaria</option>
                      <option>Burkina Faso</option>
                      <option>Burundi</option>
                      <option>Côte d&apos;Ivoire</option>
                      <option>Cabo Verde</option>
                      <option>Cambodia</option>
                      <option>Cameroon</option>
                      <option>Canada</option>
                      <option>Central African Republic</option>
                      <option>Chad</option>
                      <option>Chile</option>
                      <option>China</option>
                      <option>Colombia</option>
                      <option>Comoros</option>
                      <option>Congo (Congo-Brazzaville)</option>
                      <option>Costa Rica</option>
                      <option>Croatia</option>
                      <option>Cuba</option>
                      <option>Cyprus</option>
                      <option>Czechia (Czech Republic)</option>
                      <option>Democratic Republic of the Congo</option>
                      <option>Denmark</option>
                      <option>Djibouti</option>
                      <option>Dominica</option>
                      <option>Dominican Republic</option>
                      <option>Ecuador</option>
                      <option>Egypt</option>
                      <option>El Salvador</option>
                      <option>Equatorial Guinea</option>
                      <option>Eritrea</option>
                      <option>Estonia</option>
                      <option>Eswatini (fmr. &quot;Swaziland&quot;)</option>
                      <option>Ethiopia</option>
                      <option>Fiji</option>
                      <option>Finland</option>
                      <option>France</option>
                      <option>Gabon</option>
                      <option>Gambia</option>
                      <option>Georgia</option>
                      <option>Germany</option>
                      <option>Ghana</option>
                      <option>Greece</option>
                      <option>Grenada</option>
                      <option>Guatemala</option>
                      <option>Guinea</option>
                      <option>Guinea-Bissau</option>
                      <option>Guyana</option>
                      <option>Haiti</option>
                      <option>Holy See</option>
                      <option>Honduras</option>
                      <option>Hungary</option>
                      <option>Iceland</option>
                      <option>India</option>
                      <option>Indonesia</option>
                      <option>Iran</option>
                      <option>Iraq</option>
                      <option>Ireland</option>
                      <option>Israel</option>
                      <option>Italy</option>
                      <option>Jamaica</option>
                      <option>Jordan</option>
                      <option>Kazakhstan</option>
                      <option>Kenya</option>
                      <option>Kiribati</option>
                      <option>Kuwait</option>
                      <option>Kyrgyzstan</option>
                      <option>Laos</option>
                      <option>Latvia</option>
                      <option>Lebanon</option>
                      <option>Lesotho</option>
                      <option>Liberia</option>
                      <option>Libya</option>
                      <option>Liechtenstein</option>
                      <option>Lithuania</option>
                      <option>Luxembourg</option>
                      <option>Madagascar</option>
                      <option>Malawi</option>
                      <option>Malaysia</option>
                      <option>Maldives</option>
                      <option>Mali</option>
                      <option>Malta</option>
                      <option>Marshall Islands</option>
                      <option>Mauritania</option>
                      <option>Mauritius</option>
                      <option>Mexico</option>
                      <option>Micronesia</option>
                      <option>Moldova</option>
                      <option>Monaco</option>
                      <option>Mongolia</option>
                      <option>Montenegro</option>
                      <option>Morocco</option>
                      <option>Mozambique</option>
                      <option>Myanmar (formerly Burma)</option>
                      <option>Namibia</option>
                      <option>Nauru</option>
                      <option>Nepal</option>
                      <option>Netherlands</option>
                      <option>New Zealand</option>
                      <option>Nicaragua</option>
                      <option>Niger</option>
                      <option>Nigeria</option>
                      <option>North Korea</option>
                      <option>North Macedonia</option>
                      <option>Norway</option>
                      <option>Oman</option>
                      <option>Pakistan</option>
                      <option>Palau</option>
                      <option>Palestine State</option>
                      <option>Panama</option>
                      <option>Papua New Guinea</option>
                      <option>Paraguay</option>
                      <option>Peru</option>
                      <option>Philippines</option>
                      <option>Poland</option>
                      <option>Portugal</option>
                      <option>Qatar</option>
                      <option>Romania</option>
                      <option>Russia</option>
                      <option>Rwanda</option>
                      <option>Saint Kitts and Nevis</option>
                      <option>Saint Lucia</option>
                      <option>Saint Vincent and the Grenadines</option>
                      <option>Samoa</option>
                      <option>San Marino</option>
                      <option>Sao Tome and Principe</option>
                      <option>Saudi Arabia</option>
                      <option>Senegal</option>
                      <option>Serbia</option>
                      <option>Seychelles</option>
                      <option>Sierra Leone</option>
                      <option>Singapore</option>
                      <option>Slovakia</option>
                      <option>Slovenia</option>
                      <option>Solomon Islands</option>
                      <option>Somalia</option>
                      <option>South Africa</option>
                      <option>South Korea</option>
                      <option>South Sudan</option>
                      <option>Spain</option>
                      <option>Sri Lanka</option>
                      <option>Sudan</option>
                      <option>Suriname</option>
                      <option>Sweden</option>
                      <option>Switzerland</option>
                      <option>Syria</option>
                      <option>Tajikistan</option>
                      <option>Tanzania</option>
                      <option>Thailand</option>
                      <option>Timor-Leste</option>
                      <option>Togo</option>
                      <option>Tonga</option>
                      <option>Trinidad and Tobago</option>
                      <option>Tunisia</option>
                      <option>Turkey</option>
                      <option>Turkmenistan</option>
                      <option>Tuvalu</option>
                      <option>Uganda</option>
                      <option>Ukraine</option>
                      <option>United Arab Emirates</option>
                      <option>United Kingdom</option>
                      <option>United States of America</option>
                      <option>Uruguay</option>
                      <option>Uzbekistan</option>
                      <option>Vanuatu</option>
                      <option>Venezuela</option>
                      <option>Vietnam</option>
                      <option>Yemen</option>
                      <option>Zambia</option>
                      <option>Zimbabwe</option>
                    </>
                  )}
                </select>
              </div>
              <Field
                type="text"
                pattern="\d{3}-\d{3,4}-\d{3,4}"
                name="phone"
                label="Phone Number | 携帯電話番号"
                placeholder="090-0000-0000"
                description='Use "-" between numbers.<br />「-（ハイフン）」を使用してください。'
                required={japan}
              />
              <div className="flex items-center justify-center mt-4 mb-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <input
                      id="newsLetter"
                      type="checkbox"
                      checked={letter}
                      onChange={() => setLetter((prev) => !prev)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2"
                    />
                    <label htmlFor="newsLetter" className="ms-2 text-sm">
                      I agree to recieve message from Student Union.
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="agree"
                      type="checkbox"
                      checked={agreement}
                      onChange={() => setAgreement((prev) => !prev)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2"
                    />
                    <label htmlFor="agree" className="ms-2 text-sm">
                      I agree to the{" "}
                      <a
                        target="_blank"
                        href={`${getUrl()}/resource/agreement`}
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        terms and conditions
                      </a>
                      .
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-row gap-4">
                <SubmitButton
                  label="情報を登録する"
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  handleSubmit={handleMemberInfo}
                  isValid={agreement}
                />
              </div>
            </div>
          )}

          <div className={page !== 2 ? "hidden" : ""}>
            <Field
              type="text"
              // only for chuo university
              pattern="[0-9]{2}F11[0-9]{5}[A-L]"
              name="student-no"
              label="Studnet ID | 学籍番号"
              placeholder="22F1101001A"
              required={true}
            />
            <Field
              type="email"
              // only for chuo university
              pattern="[a-z][0-9]{2}\.[a-z0-9]{4}@g.chuo-u.ac.jp"
              name="student-email"
              label="University Email | 大学メールアドレス"
              placeholder="a00.0000@uni-domain.ac.jp"
              required={true}
            />
            <div className="mt-8 flex flex-row gap-4">
              <SubmitButton
                label="Send Code"
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleSubmit={handleSendCode}
              />
            </div>
          </div>

          {page == 3 && (
            <div>
              <Field
                type="text"
                pattern="[0-9]{6}"
                name="verification-code"
                label="Verification Code | 認証コード"
                placeholder="Enter the code sent to your email"
                required={true}
              />
              <div className="text-red-600">{codeError}</div>
              <div className="mt-8 flex flex-row gap-4">
                <SubmitButton
                  label="verify"
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  handleSubmit={handleVerifyCode}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
