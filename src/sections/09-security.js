// Section 9 — Security in System Design
export default {
  sec: "Security in System Design", color: "#f7768e",
  lessons: [
    { id: "auth", title: "Authentication & Authorization", anim: "auth",
      what: "Two distinct questions: who you are, and what you may do.",
      points: [
        "Authentication (AuthN) verifies identity: passwords, OTP, OAuth, biometrics, MFA.",
        "Authorization (AuthZ) decides permissions: roles (RBAC), scopes, policies.",
        "OAuth2/OpenID Connect enable 'Sign in with Google' style delegated auth.",
        "Always authenticate first, then authorize each action.",
      ],
      use: "On GitHub, logging in (AuthN) proves you're you. Then authorization decides you can push to your own repo but only read someone else's — same identity, different permissions per resource.",
      code: `import hashlib, hmac

USERS = {"ada": hashlib.sha256(b"hunter2").hexdigest()}
ROLES = {"ada": {"read", "write"}}

def authenticate(user, password):     # who are you?
    h = hashlib.sha256(password.encode()).hexdigest()
    return hmac.compare_digest(USERS.get(user, ""), h)

def authorize(user, action):          # what may you do?
    return action in ROLES.get(user, set())

print(authenticate("ada", "hunter2"))  # True
print(authorize("ada", "delete"))      # False` },
    { id: "encrypt", title: "Data Protection & Secure Communication", anim: "encrypt",
      what: "Keeping data unreadable to attackers in transit and at rest.",
      points: [
        "Encrypt in transit with TLS/HTTPS; encrypt at rest on disk/DB.",
        "Symmetric (AES) is fast for bulk data; asymmetric (RSA/ECC) secures key exchange.",
        "Hash + salt passwords (bcrypt/argon2) — never store them in plaintext.",
        "Manage keys carefully (KMS, rotation); the key is the weakest link.",
      ],
      use: "WhatsApp end-to-end encrypts messages so even WhatsApp can't read them. Banks encrypt your data at rest and force HTTPS so no one on the network can intercept your credentials.",
      code: `import hashlib, hmac, os

# Never store plaintext passwords — hash with a per-user salt
def hash_password(pw):
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt, 200_000)
    return salt + digest

def verify(pw, stored):
    salt, digest = stored[:16], stored[16:]
    test = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt, 200_000)
    return hmac.compare_digest(test, digest)

blob = hash_password("hunter2")
print(verify("hunter2", blob))   # True` },
    { id: "netsec", title: "Network & Infrastructure Security", anim: "netsec",
      what: "Protecting the systems and networks your app runs on.",
      points: [
        "Defense in depth: firewalls, network segmentation (VPCs/subnets), security groups.",
        "Least privilege: every component gets only the access it strictly needs.",
        "DDoS protection, WAFs, and rate limiting blunt large-scale attacks.",
        "Monitor, log, and patch continuously — security is ongoing, not one-time.",
      ],
      use: "A production AWS setup puts databases in private subnets unreachable from the internet, allows only the app servers to reach them, and fronts everything with a WAF and DDoS protection — layered defense.",
      code: `import ipaddress

# Least-privilege firewall: deny by default, allow explicitly
ALLOW = {("10.0.0.0/8", 443), ("10.0.0.0/8", 22)}

def allowed(src_ip, port):
    ip = ipaddress.ip_address(src_ip)
    for cidr, p in ALLOW:
        if port == p and ip in ipaddress.ip_network(cidr):
            return True
    return False              # anything not allowed is blocked

print(allowed("10.1.2.3", 443))   # True
print(allowed("8.8.8.8", 443))    # False` },
  ],
};
