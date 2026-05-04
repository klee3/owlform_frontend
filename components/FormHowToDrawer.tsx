"use client";

import { Button, Drawer } from "@heroui/react";

const FormHowToDrawer = ({ formSlug }: { formSlug: string }) => {
  return (
    <Drawer>
      <Button variant="secondary">How to use</Button>

      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />

            <Drawer.Header>
              <Drawer.Heading>Embed & Use This Form Anywhere</Drawer.Heading>
            </Drawer.Header>

            <Drawer.Body>
              <div className="space-y-6 text-sm text-gray-600">
                {/* SECTION 1 */}
                <div>
                  <p className="font-semibold text-gray-900 mb-2">
                    1. Embed this form in your website
                  </p>

                  <p className="mb-2">
                    Use a simple HTML form and point it to your form endpoint:
                  </p>

                  <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                    {`<form action="${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${formSlug}" method="POST">
  <input name="name" placeholder="Your name" />
  <input name="email" placeholder="Email" />
  <textarea name="message"></textarea>

  <button type="submit">Send</button>
</form>`}
                  </pre>

                  <p className="mt-2 text-gray-500">
                    Any field you send will be stored as JSON automatically.
                  </p>
                </div>

                {/* SECTION 2 */}
                <div>
                  <p className="font-semibold text-gray-900 mb-2">
                    2. How submission works
                  </p>

                  <p>Submissions are sent to:</p>

                  <pre className="bg-gray-100 p-3 rounded-md text-xs mt-2">
                    POST {process.env.NEXT_PUBLIC_API_BASE_URL}/form/{formSlug}
                  </pre>

                  <p className="mt-2">
                    All request body fields are stored inside your form response
                    database.
                  </p>
                </div>

                {/* SECTION 3 */}
                <div>
                  <p className="font-semibold text-gray-900 mb-2">
                    3. Redirect behavior after submission
                  </p>

                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      If <code>redirectUrl</code> is provided → user is
                      redirected there
                    </li>
                    <li>
                      If not provided → system uses <code>referer</code> header
                    </li>
                    <li>
                      If both are missing → user lands on default success page
                    </li>
                  </ul>

                  <pre className="bg-gray-100 p-3 rounded-md text-xs mt-2">
                    {`POST ${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${formSlug}?redirectUrl=https://example.com/thanks`}
                  </pre>
                </div>

                {/* SECTION 4 */}
                <div>
                  <p className="font-semibold text-gray-900 mb-2">💡 Pro Tip</p>

                  <p>
                    Use redirect URLs to send users to a thank-you page, booking
                    page, or custom funnel step after submission.
                  </p>
                </div>
              </div>
            </Drawer.Body>

            <Drawer.Footer>
              <Button slot="close" variant="secondary">
                Close
              </Button>
              <Button slot="close">Got it</Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default FormHowToDrawer;
