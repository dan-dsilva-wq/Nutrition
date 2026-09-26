import Foundation
import Capacitor
import AuthenticationServices

/// Native Sign in with Apple for the web app. JS calls `AppleSignIn.authorize({ nonce })`
/// with the SHA-256 of a random nonce, then hands the returned identity token and the
/// raw nonce to Supabase `signInWithIdToken`. Registered in `PaceBridgeViewController`.
@objc(AppleSignInPlugin)
public class AppleSignInPlugin: CAPPlugin, CAPBridgedPlugin, ASAuthorizationControllerDelegate,
    ASAuthorizationControllerPresentationContextProviding {
    public let identifier = "AppleSignInPlugin"
    public let jsName = "AppleSignIn"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authorize", returnType: CAPPluginReturnPromise)
    ]

    private var pendingCall: CAPPluginCall?

    @objc func authorize(_ call: CAPPluginCall) {
        if pendingCall != nil {
            call.reject("Sign in with Apple is already in progress.", "IN_PROGRESS")
            return
        }

        let request = ASAuthorizationAppleIDProvider().createRequest()
        request.requestedScopes = [.fullName, .email]
        if let nonce = call.getString("nonce"), !nonce.isEmpty {
            request.nonce = nonce
        }

        pendingCall = call
        DispatchQueue.main.async {
            let controller = ASAuthorizationController(authorizationRequests: [request])
            controller.delegate = self
            controller.presentationContextProvider = self
            controller.performRequests()
        }
    }

    public func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return bridge?.webView?.window ?? ASPresentationAnchor()
    }

    public func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithAuthorization authorization: ASAuthorization
    ) {
        guard let call = pendingCall else { return }
        pendingCall = nil

        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
              let tokenData = credential.identityToken,
              let identityToken = String(data: tokenData, encoding: .utf8) else {
            call.reject("Apple didn't return an identity token.", "NO_TOKEN")
            return
        }

        var result: [String: Any] = [
            "identityToken": identityToken,
            "user": credential.user
        ]
        if let codeData = credential.authorizationCode,
           let code = String(data: codeData, encoding: .utf8) {
            result["authorizationCode"] = code
        }
        // Apple only sends name and email on the very first authorization.
        if let email = credential.email {
            result["email"] = email
        }
        if let given = credential.fullName?.givenName {
            result["givenName"] = given
        }
        if let family = credential.fullName?.familyName {
            result["familyName"] = family
        }
        call.resolve(result)
    }

    public func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithError error: Error
    ) {
        guard let call = pendingCall else { return }
        pendingCall = nil

        if let authError = error as? ASAuthorizationError, authError.code == .canceled {
            call.reject("Sign in with Apple was cancelled.", "CANCELED")
        } else {
            call.reject(error.localizedDescription, "FAILED", error)
        }
    }
}
