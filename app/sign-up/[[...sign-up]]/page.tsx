// import { SignUp } from "@clerk/nextjs";

// export default function SignUpPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50">
//       <SignUp 
//         appearance={{
//           elements: {
//             rootBox: "mx-auto",
//             card: "shadow-lg",
//           },
//         }}
//         routing="path"
//         path="/sign-up"
//         signInUrl="/sign-in"
//         forceRedirectUrl="/"
//       />
//     </div>
//   );
// }

// app/sign-up/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}

