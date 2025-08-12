// import React, { useEffect } from 'react';
// import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { app } from '../firebaseConfig';
// import { useAppDispatch } from '../hooks/useAppSelector';


// const auth = getAuth(app);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user && user.email) {
//         let role: 'admin' | 'support_manager' = 'support_manager';
//         if (user.email === 'admin@example.com') role = 'admin';

//         dispatch(loginSuccess({ email: user.email, role }));
//       } else {
//         dispatch(logoutAction());
//       }
//     });
//     return () => unsubscribe();
//   }, [dispatch]);

 

//   return <>{children}</>;
// };
